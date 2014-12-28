Dot = require('../Dot')
utils = require('../utils.coffee')


module.exports = class Heri


  getDots: (width, height) =>
    s0 = Math.max(width, height, 800) * 0.0002

    @dots = []
    d = Math.max(width, height, 800) / 12
    for y in [0..(height / d) + 1]
      for x in [0..(width / d) + 1]
        dot = new Dot(x * d + utils.rr(d * 1.5), y * d + utils.rr(d * 1.5), d * utils.rnr(0.1, 0.8))
        a = Math.random() * Math.PI * 2
        s = s0 * utils.rnr(0.5, 0.9)
        dot.vx = Math.cos(a) * s
        dot.vy = Math.sin(a) * s
        @dots.push(dot)
    return @dots


  animate: ->
    for dot in @dots
      dot.x += dot.vx
      dot.y += dot.vy
