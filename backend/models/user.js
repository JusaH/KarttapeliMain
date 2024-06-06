const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


//"muotti" käyttäjälle 
const userSchema = mongoose.Schema({

    //käytttäjän pitää olla uniikki
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: String,
    points: Number,
	guessCounter: {
		type: Number,
		default: 0
	},
	currentDaily: String,
    dailyDone: {
      type: Boolean,
      default: false
    },
	sid: String
})

//Muokkaa response loginiin, siten että passwordHashia ja muuta
// turhaketta ei palauteta
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
  })

// otetaan käyttöön uniíkkiuden testaukseen käytettävä plugini
userSchema.plugin(uniqueValidator)



const User = mongoose.model('User',userSchema)

module.exports = User