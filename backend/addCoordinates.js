const {schema, Coordinate} = require('./models/coordinate')
const coordinates = require('./coordinates')
require('dotenv').config()

//Ajamalla node addCoordinates.js voit lisätä
// koordinaatteja mongodb:hen
//Käyttöohje: Poista coordinates.js tiedoston taulukon alkiot
//ja korvaa vastaavanlaisilla omilla. Aja "node addCoordinates.js"

//Mongodb:n käyttöönotto
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const connectToMongo = async() => {
    mongoose.connect(process.env.MONGODB_URL)
    return mongoose
}

//lisää jokaisen coordinates taulukon
// elementin mongoDB:hen
const addAll = async () =>{
    coordinates.forEach(async (element) => {

        console.log(element)
        const coord = new Coordinate({
            ...element
        }
            
        )
        await coord.save()      
    })
}

//pääohjelma
const main = async() => {
    await connectToMongo()
    await addAll()
}

//TODO: ei toimi mongoose.connection.close()

main()