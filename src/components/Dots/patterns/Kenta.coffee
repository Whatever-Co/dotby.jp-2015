matrix = require('gl-matrix')
Dot = require('../Dot')


RADS = [0, 0.3, 0.6, 1.0]

MAX_COUNT = [
  [2, 3, 4, 5],
  [2, 3, 4, 5, 6],
  [2, 3, 4],
  [1, 1]
]


module.exports = class Kenta


  getDots: (width, height) ->
    m = matrix.mat2d.create()
    matrix.mat2d.rotate(m, m, -45 * Math.PI / 180)
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
    dx = Math.max(width, height, 800) / 20
    dy = dx
    minX -= dx
    maxX += dx
    minY -= dy
    maxY += dy
    y = minY
    p = matrix.vec2.create()
    baseR = dx * 0.25
    r = baseR
    cnt = 0
    idx = pIdx = 0
    cntIdx = pCntIdx = 0
    while y < maxY
      x = minX
      while x < maxX
        matrix.vec2.transformMat2d(p, [x, y], m)
        if cnt > 0
          cnt--
        else
          loop
            idx = Math.floor(Math.random() * RADS.length)
            break if idx != pIdx
          pIdx = idx
          loop
            cntIdx = Math.floor(Math.random() * MAX_COUNT[idx].length)
            cnt = MAX_COUNT[idx][cntIdx]
            break if cntIdx != pCntIdx
          pCntIdx = cntIdx
          r = baseR * RADS[idx]
        if r != 0 and -r < p[0] < width + r and -r < p[1] < height + r
          @dots.push(new Dot(p[0], p[1], r))
        x += dx
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
