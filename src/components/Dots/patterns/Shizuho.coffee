Dot = require('../Dot')


module.exports = class Hige


  getDots: (width, height) ->
    @dots = []

    dx = Math.max(width, height, 800) / 4
    dy = dx / 2 / Math.tan(30 * Math.PI / 180)
    s = dx / 350

    ix = -dx * Math.random()
    iy = -dy * Math.random()

    y = iy
    even = false
    while y < height + dy
      x = if even then -dx / 2 else 0
      x += ix
      while x < width + dx
        cx = x
        cy = y
        r = 7 * s
        r2 = 20 * s
        @dots.push(new Dot(cx, cy, r))
        for i in [0...5]
          a = i / 5 * Math.PI * 2
          @dots.push(new Dot(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, r))
        r = 4.5 * s
        r2 = 37.5 * s
        for i in [0...12]
          a = i / 12 * Math.PI * 2
          @dots.push(new Dot(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, r))
        r = 7 * s
        r2 = 60 * s
        for i in [0...12]
          a = (i + 0.5) / 12 * Math.PI * 2
          @dots.push(new Dot(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2, r))
        x += dx
      y += dy
      even = not even
    

    a = Math.random() * Math.PI * 2
    s = Math.max(width, height, 800) * 0.0002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
