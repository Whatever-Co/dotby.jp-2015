Dot = require('../Dot')


module.exports = class Sfman


  getDots: (width, height) ->
    a = Math.random() * Math.PI * 2
    s = 0.2
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return [@dot = new Dot(width / 2, height / 2, Math.min(width, height) * 0.35)]


  animate: ->
    @dot.x += @vx
    @dot.y += @vy
