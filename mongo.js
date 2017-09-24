'use strict'

// import modules
var mongoose = require('mongoose')
var assert = require('assert')

//get the Schema and mapping mongodb collection
var Schema = mongoose.Schema

var movieSchema = new Schema({
    title: String,
    info: String,
    star: String,
    link: String,
    picUrl: String
})

//mapping collection
var movie = mongoose.model('movie', movieSchema)

//connect mongodb
var db = mongoose.connect('mongodb://127.0.0.1:27017/spider')
db.connection.on('error', (err) => {
    console.log('Connect database failed: ${err}')
})
db.connection.on('open', () => {
    console.log('Connect database success')
})

module.exports = {movie: movie}