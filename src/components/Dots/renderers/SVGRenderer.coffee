_ = require('underscore')
Snap = require('snapsvg')


class Background


  constructor: (@paper) ->
    @rect = @paper.rect(0, 0, innerWidth, innerHeight)
    @resize()


  resize: =>
    @pat?.remove()

    g = @paper.g().attr(class: 'base', stroke: 'none', fill: 'rgba(0, 0, 0, 0.05)')
    w = Math.max(innerWidth, innerHeight, 800) / 14
    @step = w
    hw = w * 0.5
    r = w * 0.2
    g.add(@paper.circle(hw, 0, r))
    g.add(@paper.circle(0, hw, r))
    g.add(@paper.circle(w, hw, r))
    g.add(c = @paper.circle(hw, w, r))
    @pat = g.pattern(0, 0, w, w)
    @rect.attr(fill: @pat, width: innerWidth, height: innerHeight)


  animate: (t) =>
    t *= @step * 0.00008
    @pat.attr(x: t * 5, y: t * -1.5)



class SVGRenderer


  constructor: (container) ->
    @paper = Snap(window.innerWidth, window.innerHeight)
    container.appendChild(@paper.node)
    @currentColor = Snap.color('#E62172')
    @dotsLayer = @paper.g().attr(stroke: 'none', fill: @currentColor.toString())
    @elements = {}
    @background = new Background(@paper)
    @epoch = Date.now()


  update: (dots) ->
    updated = {}
    for dot in dots
      if @elements[dot.id]
        @elements[dot.id].attr(cx: dot.x, cy: dot.y, r: dot.radius)
      else
        el = @paper.circle(dot.x, dot.y, dot.radius)
        @dotsLayer.add(el)
        @elements[dot.id] = el
      updated[dot.id] = true

    for id in _.keys(@elements)
      if not updated[id]
        @elements[id].remove()
        delete @elements[id]

    @background.animate(Date.now() - @epoch)


  setColor: (r, g, b) ->
    @dotsLayer.attr(fill: Snap.rgb(r, g, b))


  setSize: (width, height) ->
    @paper.attr(width: width, height: height)


module.exports = SVGRenderer
