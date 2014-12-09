Dot = require('../Dot')


module.exports = class Saqoosha


  getDots: (width, height) ->
    scale = Math.min(width, height) / 1024

    a = Math.random() * Math.PI * 2
    s = 0.2 * scale
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    @dots = []
    dx = 150 * scale
    dy = dx / 2
    r = dx * 0.1667
    y = 0
    even = false
    id = 0
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

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
