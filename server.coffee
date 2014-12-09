express = require('express')
app = express()
path = require('path')
request = require('request')


app.get /^\/wp-json.*$/, (req, res) ->
#  console.log(req.originalUrl)
  request('http://new.dev.dotby.jp' + req.originalUrl).pipe(res)

app.get /^[\w\-\/]*$/, (req, res) ->
  res.sendFile(path.resolve(__dirname, 'dist/index.html'))

module.exports = app
