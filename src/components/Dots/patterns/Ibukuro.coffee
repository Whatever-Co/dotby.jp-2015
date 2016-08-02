matrix = require('gl-matrix')
Dot = require('../Dot')

toRad = Math.PI / 180

module.exports = class Seki


  getDots: (width, height) ->
    m = matrix.mat2d.create()
    a = Math.random() * 15 + 7.5
    if Math.random() < 0.5 then a *= -1
    matrix.mat2d.rotate(m, m, a * toRad)
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
    s = Math.max(0.5, window.innerWidth / 1280)
    dx = 18.8 * s
    dy = 233 * s
    dyy = 32.5 * s
    p = matrix.vec2.create()
    r = 11.5 * s
    y = minY
    while y < maxY
      x = minX
      # y = (minY + maxY) / 2
      i = 0
      while x < maxX
        yy = y + (3 - Math.abs(i++ % 12 - 6)) * dyy
        matrix.vec2.transformMat2d(p, [x, yy], m)
        x += dx
        if -r < p[0] < width + r and -r < p[1] < height + r
          @dots.push(new Dot(p[0], p[1], r))
      y += dy

    a = Math.random() * Math.PI * 2
    s = Math.max(width, height, 800) * 0.0002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
