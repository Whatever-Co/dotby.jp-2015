express = require('express')
compression = require('compression')

app = require('./server')
app.use(compression({
  threshold: 0
  level: 9
  memLevel: 9
}))
app.use(express.static('dist'))
app.listen(8000, ->
    console.log('Running server on port 8000')
    )
