express = require('express')
compression = require('compression')
ngrok = require('ngrok')
open = require('open')

PORT = 8000

ngrok.connect({
    proto: 'http'
    addr: PORT
    region: 'ap'
    }, (err, url) ->
        if err
            console.log(err)
        else
            console.log("Connected ngrok. #{url}")
            open(url)
        )

app = require('./server')
app.use(compression({
  threshold: 0
  level: 9
  memLevel: 9
}))
app.use(express.static('dist'))
app.listen(PORT, ->
    console.log("Running server on port #{PORT}")
    )
