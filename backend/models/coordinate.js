const mongoose = require('mongoose')


//"muotti" koordinaateille
const coordinateSchema = mongoose.Schema({

    city: {
        type: String,
        required: true,
    },
    tips:[String],
    date:String,
    coordinates: {
        type: Object,
        required: true
    }
    
})

//Muokkaa responsea,
// turhaketta ei palauteta
coordinateSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Coordinate = mongoose.model('Coordinate',coordinateSchema)

module.exports = {schema:coordinateSchema,
                  Coordinate:Coordinate}