'use strict'

// import modules
var http = require('http')
var https = require('https')
var fs = require('fs')
var path = require('path')
var cheerio = require('cheerio')

// spider info, if website use http 
var opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
}

//create spider 
function *doSpider(x) {
    var start = 0
    console.log(start + ' -------------------------------')
    while (start < x) {
        yield start
        spiderMovie(start)
        start += 25
    }
}
for (var x of doSpider(250)) {
    console.log(x)
}

// create https get request
function spiderMovie(index) {
    https.get('https://movie.douban.com/top250?start=' + index, function (res) {
        var pageSize = 25
        var html = '' // save html
        var movies = []  // save data
        
        // setEncoding
        res.setEncoding('utf-8')
        
        // get the page
        res.on('data', function (chunk) {
            html += chunk
        })
        res.on('end', function () {
            // use cheerio to parse the html
            var $ = cheerio.load(html)
            
            $('.item').each(function () {
                // get the picture url link
                var picUrl = $('.pic img', this).attr('src')
                var movie = {
                    title: $('.title', this).text(), // get movie name
                    star: $('.info .star .rating_num', this).text(), // get movie point
                    link: $('a', this).attr('href'), // get movie link
                    picUrl: picUrl
                }
                
                if (movie) {
                    movies.push(movie)
                }
                // download image
                downloadImg('img/', movie.picUrl)
            })
            // save crawl data
            saveData('data/data' + (index / pageSize) + '.json', movies)
        })
    }).on('error', function (err) {
        console.log(err)
    })
}

//save data to local
function saveData(path, movies) {
    console.log(movies)
    // use fs.writeFile 
    // fs.writeFile(filename, data[, options], callback)
    fs.writeFile(path, JSON.stringify(movies, null, ' '), function (err) {
        if (err) {
            return console.log(err)
        }
        console.log('Data saved')
    });
}

// download image
function downloadImg(imgDir, url) {
    https.get(url, function (res) {
        var data = ''
        res.setEncoding('binary')
        res.on('data', function (chunk) {
            data += chunk
        })
        res.on('end', function () {
            // use fs.writeFile to save imags to local
            fs.writeFile(imgDir + path.basename(url), data, 'binary', function (err) {
                if (err) {
                    return console.log(err)
                }
                console.log('Image downloaded: ', path.basename(url))
            })
        })
    }).on('error', function (err) {
        console.log(err)
    })
} 
 
