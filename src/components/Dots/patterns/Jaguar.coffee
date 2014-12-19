matrix = require('gl-matrix')
Dot = require('../Dot')
utils = require('../utils')


module.exports = class Jaguar


  constructor: ->
    @canvas = document.createElement('canvas')
    @canvas.width = 256
    @canvas.height = 256
    @context = @canvas.getContext('2d')


  getDots: (width, height) ->
    @context.fillStyle = '#000000'
    @context.fillRect(0, 0, @canvas.width, @canvas.height)

    for i in [0...8]
      @context.beginPath()
      @context.arc(Math.random() * @canvas.width, Math.random() * @canvas.height, utils.rnr(50, 80), 0, Math.PI * 2, false)
      @context.closePath()
      @context.fillStyle = '#00000' + (i % 4)
      @context.fill()

    @pixels = @context.getImageData(0, 0, @canvas.width, @canvas.height)

    @dots = []
    w = Math.max(width, height, 800)
    @_fill(width, height, 0, w / 10, 0.08)
    @_fill(width, height, 1, w / 30, 0.16)
    @_fill(width, height, 2, w / 20, 0.22)
    @_fill(width, height, 3, w / 8, 0.22)

    a = Math.random() * Math.PI * 2
    s = 0 #dx * 0.0015
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  _fill: (width, height, color, dx, r) ->
    m = matrix.mat2d.create()
    matrix.mat2d.rotate(m, m, Math.random() * Math.PI * 2)
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

    s = Math.min(@pixels.width / width, @pixels.height / height)
    dy = dx / 2 / Math.tan(30 * Math.PI / 180)
    minX -= dx
    maxX += dx
    minY -= dy
    maxY += dy
    y = minY
    even = false
    r *= dx
    p = matrix.vec2.create()
    while y < maxY
      x = minX
      if even then x -= dx / 2
      while x < maxX
        matrix.vec2.transformMat2d(p, [x, y], m)
        px = Math.max(0, Math.min(@pixels.width - 1, Math.round(p[0] * s)))
        py = Math.max(0, Math.min(@pixels.height - 1, Math.round(p[1] * s)))
        index = (px + py * @pixels.width) * 4
        if -r < p[0] < width + r and -r < p[1] < height + r and @pixels.data[index + 2] is color
          @dots.push(new Dot(p[0], p[1], r))
        x += dx
      y += dy
      even = not even


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy
