express = require('express')
app = express()
path = require('path')

app.get /^[\w\-\/]*$/, (req, res) ->
  res.sendfile(path.resolve(__dirname, 'dist/index.html'))

module.exports = app
