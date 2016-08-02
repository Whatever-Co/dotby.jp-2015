Dot = require('../Dot')


DATA = [
  [-24.5, -76.0, 29.7]
  [-62.9, -51.1, 32.4]
  [-82.6,  -5.6, 34.0]
  [-68.0,  45.1, 36.7]
  [-20.4,  76.9, 37.9]
  [ 33.6,  70.1, 35.9]
  [ 72.5,  21.3, 35.9]
  [ 68.3, -33.5, 27.4]
  [ 38.1, -66.5, 24.7]
  [ 24.5, -72.7, 15.3]
  [  5.5, -78.1,  8.5]
].map (p) ->
  x = p[0]
  y = p[1]
  p.push(Math.atan2(y, x))
  p.push(Math.sqrt(x * x + y * y))
  return p


module.exports = class Hige


  getDots: (width, height) ->
    @dots = []

    dx = Math.max(width, height, 800) / 6
    dy = dx / 2 / Math.tan(30 * Math.PI / 180) * 1.3
    s = dx / 250

    ix = -dx * Math.random()
    iy = -dy * Math.random()

    y = iy
    even = false
    while y < height + dy
      x = if even then -dx / 2 else 0
      x += ix
      while x < width + dx
        aa = Math.random() * Math.PI * 2
        for p in DATA
          a = p[3] + aa
          r = p[4] * s
          @dots.push(new Dot(x + Math.cos(a) * r, y + Math.sin(a) * r, p[2] / 2 * s))
          # @dots.push(new Dot(x + p[0], y + p[1], p[2] / 2))
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
