var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var csvWriter = require('csv-write-stream');
var writer = csvWriter();
const path = require('path');


function webScraper(http, headers, fileOutput){

  request(http, function (error, response, body) {

    if (!error && response.statusCode == 200) {

      var filePermission = [];
      var absoluteUrl = [];
      var fileType = [];

      $ = cheerio.load(body);

      $('tr').each(function(i, elem) {
        filePermission.push( $(this).children().first().text() );
      });

      $('tr td a').each(function(i, elem) {
        absoluteUrl.push( elem.attribs.href )
      })

      absoluteUrl.forEach(function(url){
        fileType.push( path.extname(url) )
      })

    }

    var writer = csvWriter({ headers: [headers[0], headers[1], headers[2]]})
    writer.pipe(fs.createWriteStream(fileOutput))

    for(var i = 0; i < filePermission.length; i++){
      writer.write([filePermission[i], absoluteUrl[i], fileType[i]])
    }

    writer.end()  

  })

}

module.exports = webScraper;




