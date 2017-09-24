# DoubanSpider
通过Node.js实现简单爬虫，获取[豆瓣电影top250](https://movie.douban.com/top250 'doubanmovie')。主要会用到的包：http, fs, path, cheerio, mongoose

http模块用于创建http请求，fs模块用于保存文件，path用于解析路径，cheerio用于服务器端解析HTML,mongoose用于链接mongoDB。

最后将获取的数据保存为json并存储到mongodb
