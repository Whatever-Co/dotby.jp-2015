matrix = require('gl-matrix')
Dot = require('../Dot')


module.exports = class Seki


  getDots: (width, height) ->
    m = matrix.mat2d.create()
    matrix.mat2d.rotate(m, m, 10 * Math.PI / 180)
    minX = Number.MAX_VALUE
    maxX = Number.MIN_VALUE
    minY = Number.MAX_VALUE
    maxY = Number.MIN_VALUE
    for p in [[0, 0], [width, 0], [width, height], [0, height]]
      matrix.vec2.transformMat2d(p, p, m)
      if p[0] < minX then minX = p[0]
      if p[0] > maxX then maxX = p[0]
      if p[1] < minY then minY = p[1]
      if p[1] > maxY then maxY = p[1]
    matrix.mat2d.invert(m, m)

    @dots = []
    dx = Math.max(width, height, 800) / 16
    dy = dx / 2 / Math.tan(30 * Math.PI / 180)
    minX -= dx
    maxX += dx
    minY -= dy
    maxY += dy
    y = minY
    even = false
    id = 0
    r = dx * 0.16
    p = matrix.vec2.create()
    while y < maxY
      x = minX
      if even then x -= dx / 2
      while x < maxX
        matrix.vec2.transformMat2d(p, [x, y], m)
        if -r < p[0] < width + r and -r < p[1] < height + r
          @dots.push(new Dot(p[0], p[1], r))
        x += dx
      y += dy
      even = not even

    a = Math.random() * Math.PI * 2
    s = dx * 0.002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
