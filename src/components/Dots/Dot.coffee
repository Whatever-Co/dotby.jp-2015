class Dot

  @ID: 0

  constructor: (@x = 0, @y = 0, @radius = 0, @prev = null, @next = null) ->
    @id = Dot.ID++
    @vx = 0
    @vy = 0

  clone: ->
    return new Dot(@x, @y, @radius)


module.exports = Dot
