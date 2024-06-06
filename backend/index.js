const bcrypt = require('bcrypt')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const morgan = require('morgan')
morgan('tiny')
require('dotenv').config()
const User = require('./models/user.js')
const coordinateModule = require('./models/coordinate.js')
const Coordinate = coordinateModule.Coordinate
const archive = coordinateModule.schema
var cron = require('node-cron');


//Mongodb:n käyttöönotto
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)
const mongoSt = MongoStore.create({ client: mongoose.connection.getClient() })

const app = express()

app.use(cors({
	origin: 'http://localhost:3001',
    methods: ["POST", "GET"],
	credentials: true
}))
app.use(express.json())
app.use(session({
	secret: 'this must be changed to be secure',
	store: mongoSt,
	saveUninitialized: true,
	resave: true,
	cookie: {
		maxAge: 3600000
	}
}))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})

app.use(morgan(function (tokens, req, res) {

  var lokiString =[
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')

  if(tokens.method(req,res) === 'POST') {
    morgan.token('postreq',(req,res) => {
      console.log(res.header)
      return JSON.stringify(req.body)
    })

    lokiString=lokiString.concat(` ${tokens['postreq'](req,res)}`)
  }
  return lokiString
}))

app.use(express.static('dist'))

function authenticate(req, res, next) {
	if (req.session.user)
        next();
	else {
		res.status(401).send();
		next('route');
	}
}

let daily = null;

Coordinate.aggregate([{ $sample: { size: 1 } }]).then( res => {
  const date = new Date()
  daily = {...res[0], date: date.toString()}
  console.log("DAILY NYT", daily.city)
})

let topTen = null;
User.find({}).then(res => {
    res.sort(compareUsersByPoints);
    topTen = res.slice(0, 10);
})


const Archive = mongoose.model('archive', archive)

//lista vanhojen dailyjen päivämääristä
let archivedDates = []
Archive.find({})
       .then(oldDailies => {
              archivedDates = oldDailies.map(oldDaily => oldDaily.date)
            })               

                 
//suorittaa toiminnon joka päivä keskiyöllä
// Lisää nykyisen dailyn arkistoon
// Poistaa nykyisen dailyn coordinaatit taulusta
// arpoo uuden dailyn coordinates taulun elementeistä
// '*/x * * * *' jos haluaa x minuutin välein tekemään
cron.schedule('0 0 * * *', () => {

  console.log(daily.date)
  
  const coordToBeArchived = new Archive({
            city: daily.city,
            coordinates: daily.coordinates,
            date: daily.date
  })

  coordToBeArchived
    .save()
    .then(archivedCoord => {
      console.log('daily arkistoitu:', archivedCoord.city)

      Coordinate.deleteOne({city: archivedCoord.city})
      .then(deletedCount => {
        console.log('poistettujen määrä:', deletedCount)
        Coordinate.find({}).then(resultedArray => {
          if(resultedArray.length>0){
            daily = Coordinate.aggregate([{ $sample: { size: 1 } }]).then(res => {
              const date = new Date()
              daily = {...res[0], date: date.toString()}
              console.log('uusi daily:',daily.city)
            })}
          })

      })
      //päivitetään päivämäärälista
      Archive.find({})
      .then(oldDailies => {
             archivedDates = oldDailies.map(oldDaily => oldDaily.date)
           })
      

    /*User.find({}).then(users => {
      users.forEach(user => User.findOneAndUpdate({username: user.username}, {dailyDone: false}))
    })
    */

    User.updateMany({dailyDone: false}).then(
      res => console.log(res.matchedCount)
    )
      
    }) 
})



//rekisteröityminen
//TODO: Tarkistetaan, ettei samaa käyttäjänimeä
//löydy jo tietokannasta
app.post('/register', async (req, res) => {

    const { username, password } = req.body
    const query = await User.findOne({username})
    
    if(!(query === null)){
        res.status(401)
           .send('Username already in use')
           .end()
    }

    else if(password.length < 5 ){
      return res.status(400).send('password must be atleast 5 characters long')
    }

    else {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const points = 0
		const sid = null
    
        const user = new User({
          username,
          passwordHash,
          points,
          sid
        })
      
        const savedUser = await user.save()
        console.log(`käyttäjä ${savedUser.username} tallennettu`)

        // Jos alle 10 käyttäjää niin päivitetään top 10
        if (topTen.length < 10) {
          topTen.push(savedUser)
        }

        res.status(201).json(savedUser)
    } 
})



//palauttaa taulukon vanhojen dailyjen päivämääristä
app.get('/archive', (request,response) => {
  response.send(archivedDates) 
})    

//vanhojen dailyjen haku päivämäärän mukaan
app.get('/archive/:date', (request,response) => {
	Archive.findOne({date: request.params.date})
		.then(archivedDaily => {
			response.json({
				coords: archivedDaily.coordinates,
				answer: archivedDaily.city
			})
		})
		.catch(error => console.log(error))
})

//dailyn koordinaattien pyyntö
app.get('/daily', (request, response) => {
    response.json({coordinates:daily.coordinates, date:daily.date, isDaily: true})
})

app.get('/users/me', authenticate, (req, res) => {
	if (req.session.current != daily.date) {
		User.findOne({username: req.session.user})
			.then(user => {
				user.guessCounter = 0;
				user.currentDaily = daily.date;
				user.save();
			});
		req.session.dailyDone = false;
		req.session.laskuri = 0;
		req.session.current = daily.date;
	}
	
	res.json({
		name: req.session.user,
		guessed: req.session.laskuri,
		coords: daily.coordinates,
		date: daily.date
	});
})

app.get("/getTopTen", async (req, res) => {
    res.send(topTen)
})

app.get('/getUserInfo', authenticate, async function (req, res) {
    let user = {
        username: null,
        points: 0
    }
    await User.findOne({username: req.session.user})
        .then(r => {
            user = {...user, username: r.username, points: r.points}
        })
    res.send(user)
})

app.post('/', authenticate, async function(req, res) {
	if (req.session.current != daily.date) {
		req.session.current = daily.date;
		req.session.dailyDone = false;
		req.session.laskuri = 0;
		res.json({ correct: 'new daily', coords: daily.coordinates, date: daily.date });
	} else if (req.session.dailyDone) {
		console.log('Tarkistus jo tehdylle dailylle käyttäjälle', req.session.user);
	} else if (req.body.guess.toLowerCase().trim() === daily.city.toLowerCase().trim().split(',')[0]) {
		const points = 5 - req.session.laskuri;
		//req.session.laskuri = 5;
		req.session.dailyDone = true;
		res.json({
			correct: true,
			laskuri: req.session.laskuri,
			pisteet: points
		});
		User.findOne({username: req.session.user})
			.then(user => {
				console.log(user);
				if (!user.dailyDone) {
					user.points += points;
					user.dailyDone = true;
					user.save();
					updateTopTen(topTen, user, points);
				}
			});
	} else {
		// ettei pisteet mene negatiivisiksi
		if (req.session.laskuri < 5) {
			req.session.laskuri++;
		} else {
			req.session.dailyDone = true;
			req.session.laskuri = 5
			User.findOne({username: req.session.user})
				.then(user => {
					user.dailyDone = true
					user.save()
				});
		}
		res.json({
			correct: false,
			laskuri: req.session.laskuri,
            city: daily.city
		});
	}
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).send('invalid username or password')
    }

    req.session.regenerate(function (err) {
        if (err)
			next(err);
		
		const oldSid = user.sid;
		mongoSt.get(oldSid, (error, session) => {
			if (session != null)
				mongoSt.destroy(oldSid, e => console.log(e))
		})
		
		req.session.user = username;
		user.sid = req.session.id;
		console.log('sessio id: ', req.session.id);
        req.session.dailyDone = user.dailyDone;
        req.session.laskuri = user.guessCounter;
		req.session.current = user.currentDaily;
		user.save();
        req.session.save(function (err) {
            if (err)
                return next(err);
            res.status(200).send('logged in');
        })
    })
})


app.get('/cities.json', (req, res) => {
	const options = {
		root: __dirname + '/public',
		maxAge: 2592000
	};
	res.sendFile('/cities.json', options);
});

app.post('/logout', authenticate, (req, res) => {
  const username = req.session.user
  const done = req.session.dailyDone
  const laskuri = req.session.laskuri
  User.findOne({ username }).then(user => {
    user.dailyDone = done;
    user.guessCounter = laskuri;
	user.save();
    const sid = user.sid
    mongoSt.get(sid, (error, session) => {
      if (session != null)
        mongoSt.destroy(sid, e => console.log(e))
    })
  })

  res.clearCookie("connect.sid")
  req.session.destroy(() => res.sendStatus(200))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

function updateTopTen(topTen, user, pointsToAdd) {
  for (const topUser of topTen) {
    if (topUser.username === user.username) {
      topUser.points += pointsToAdd
      topTen.sort(compareUsersByPoints)
      return
    }
  }
  let last = topTen[topTen.length - 1]
  if (user.points + pointsToAdd > last.points) {
    topTen[topTen.length - 1] = user
    topTen.sort(compareUsersByPoints)
  }
}

function compareUsersByPoints(a, b) {
  return b.points - a.points
}
