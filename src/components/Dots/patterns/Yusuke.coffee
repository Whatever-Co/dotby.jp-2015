Dot = require('../Dot')
utils = require('../utils.coffee')

module.exports = class Yusuke


  getDots: (width, height) =>
    scale = Math.min(width, height) / 1024

    @dots = []
    d = 100 * scale
    id = 0
    for y in [0..(height / d) + 1]
      for x in [0..(width / d) + 1]
        a = Math.random() * Math.PI * 2
        s = utils.rnr(0.1, 0.3) * 0.5 * scale
        dot = new Dot(x * d + utils.rr(d * 0.7), y * d + utils.rr(d * 0.7), utils.rnr(25, 45) * scale)
        dot.vx = Math.cos(a) * s
        dot.vy = Math.sin(a) * s
        @dots.push(dot)
    return @dots


  animate: ->
    for dot in @dots
      dot.x += dot.vx
      dot.y += dot.vy
