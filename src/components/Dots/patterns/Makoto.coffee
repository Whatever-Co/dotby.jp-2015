Dot = require('../Dot')


SUSHI = [
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0]
];


module.exports = class Makoto


  getDots: (width, height) ->
    @dots = []
    d = Math.max(width, height, 800) / 30
    r = d * 0.25
    ix = d * Math.random()
    iy = d * Math.random()
    y = iy
    row = col = 0
    while y < height + d * 2
      x = ix
      while x < width + d * 2
        @dots.push(new Dot(x, y, r))
        x += d
        if y == iy
          row++
      y += d
      col++

    ix = Math.floor(row / 2 - SUSHI[0].length / 2 + Math.random() * 8 - 4)
    iy = Math.floor(col / 2 - SUSHI.length / 2 + Math.random() * 8 - 4)
    sx = sy = 0
    for y in [0..col]
      for x in [0..row]
        if ix <= x < ix + SUSHI[0].length and iy <= y < iy + SUSHI.length
          if SUSHI[sy][sx] == 1 and y * row + x < @dots.length
            @dots[y * row + x].radius = @dots[y * row + x].radius * 0.6
          sx++
          if sx >= SUSHI[0].length
            sx = 0
            sy++

    a = Math.random() * Math.PI * 2
    s = Math.max(width, height, 800) * 0.0002
    @vx = Math.cos(a) * s
    @vy = Math.sin(a) * s

    return @dots


  animate: ->
    for dot in @dots
      dot.x += @vx
      dot.y += @vy