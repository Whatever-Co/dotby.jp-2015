express = require('express')
app = express()
path = require('path')
request = require('request')


app.get /^\/wp-json.*$/, (req, res) ->
#  console.log(req.originalUrl)
  request('http://dotby.jp' + req.originalUrl).pipe(res)

app.get /^[\w\-\/]*$/, (req, res) ->
  res.set('Content-Type', 'text/html')
  res.sendFile(path.resolve(__dirname, 'dist/theme/index.php'))

module.exports = app
