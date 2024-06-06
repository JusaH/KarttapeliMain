const cities = require('./cities.js')
var fs = require('fs')

const parse = (cities) => {
    var file = fs.createWriteStream('array.json')
    file.on('error', function(err) { console.log('vituiks meni',err) })
    file.write('[')

    cities.map(city => {
        const newCity = {city:city.cityLabel} 
        file.write(JSON.stringify(newCity) + ',' + '\n') 
    })
    file.write(']')
    file.end()
}

parse(cities)
