Dot = require('../Dot')


module.exports = class Hige


  getDots: (width, height) ->
    @dots = []
    d = Math.max(width, height, 800) / 30
    r = d * 0.13
    ix = d * Math.random()
    iy = d * Math.random()
    y = iy
    while y < height + d * 2
      x = ix
      while x < width + d * 2
        @dots.push(new Dot(x, y, r))
        x += d
      y += d

    a = Math.random() * Math.PI * 2
    s = Math.max(width, height, 800) * 0.0002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
