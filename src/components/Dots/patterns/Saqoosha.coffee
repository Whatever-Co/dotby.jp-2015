Dot = require('../Dot')


module.exports = class Saqoosha


  getDots: (width, height) ->
    @dots = []
    dx = Math.max(width, height, 800) / 10
    dy = dx / 2
    r = dx * 0.21
    y = 0
    even = false
    while y < height + dy
      x = if even then -dx / 2 else 0
      while x < width + dx
        @dots.push(new Dot(x, y, r))
        x += dx
      y += dy
      even = not even

    while true
      d = @dots[~~(Math.random() * @dots.length)]
      if 0.2 * width < d.x < 0.8 * width and 0.2 * height < d.y < 0.8 * width
        ex = r * 0.72
        ey = r * 0.786
        er = r * 0.345
        @dots.push(new Dot(d.x - ex, d.y - ey, er))
        @dots.push(new Dot(d.x + ex, d.y - ey, er))
        break

    a = Math.random() * Math.PI * 2
    s = Math.max(width, height, 800) * 0.0002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
