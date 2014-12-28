Dot = require('../Dot')
utils = require('../utils.coffee')


module.exports = class Yusuke


  getDots: (width, height) =>
    s0 = Math.max(width, height, 800) * 0.0002

    @dots = []
    dx = Math.max(width, height, 800) / 8
    dy = dx / 2 / Math.tan(30 * Math.PI / 180)
    y = 0
    even = false
    while y < height + dy
      x = if even then -dx / 2 else 0
      while x < width + dx
        dot = new Dot(x + utils.rr(dx * 0.5), y + utils.rr(dx * 0.5), dx * utils.rnr(0.2, 0.35))
        a = Math.random() * Math.PI * 2
        s = s0 * utils.rnr(0.5, 0.9)
        dot.vx = Math.cos(a) * s
        dot.vy = Math.sin(a) * s
        @dots.push(dot)
        x += dx
      y += dy
      even = not even
    return @dots


  animate: ->
    for dot in @dots
      dot.x += dot.vx
      dot.y += dot.vy
