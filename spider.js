'use strict'

// import modules
var https = require('https')
var fs = require('fs')
var path = require('path')
var cheerio = require('cheerio')

// spider url
var opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 443
}

// create http request
https.get(opt, function(res) {
    var html = ''
    var movies = []

    res.setEncoding('utf-8')

    // get the page
    res.on('data', function(chunk) {
        html += chunk
    })

    res.on('end', function() {
        // use cheerio to parse html
        var $ = cheerio.load(html)

        $('.item').each(function() {
            var movie = {
                title: $('.title', this).text(), // movie name
                star: $('.star .rating_num', this).text(), //movie point
                link: $('a', this).attr('href'), // movie url
                picUrl: $('.pic img', this).attr('src') //movie picture link
            }

            //push movie to array
            movies.push(movie)
            // download image
            downloadImg('img/', movie.picUrl)
        })

        //save data
        saveData('data/data.json', movies)
        console.log(movies)
    })
}).on('error', function(err) {
    console.log(err)
})

// save data
function saveData(path, movies) {
    // use fs.writeFile method
    fs.writeFile(path, JSON.stringify(movies, null, 4), function(err) {
        if (err) {
            return console.log(err)
        }
        console.log('Data saved')
    })
}

//download img
function downloadImg(imgDir, url) {
    https.get(url, function(res) {
        var data = ''

        res.setEncoding('binary')

        res.on('data', function(chunk) {
            data += chunk
        })

        res.on('end', function() {
            fs.writeFile(imgDir + path.basename(url), data, 'binary', function(err) {
                if (err) {
                    return console.log(err)
                }
                console.log('Image downloaded:', path.basename(url))
            })
        })
    }).on('error', function(err) {
        console.log(err)
    })
}