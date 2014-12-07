express = require('express')
app = express()
path = require('path')

app.get /^[\w\-\/]*$/, (req, res) ->
  res.sendFile(path.resolve(__dirname, 'dist/index.html'))

module.exports = app
