$ = require('jquery')
_ = require('underscore')
Snap = require('snapsvg')
THREE = require('three')
QUAD = require('./quadtree')
TWEEN = require('tween.js')
#Stats = require('stats-js')

SVGRenderer = require('./renderers/SVGRenderer')
WebGLRenderer = require('./renderers/WebGLRenderer')

Dot = require('./Dot')
Yusuke = require('./patterns/Yusuke')
Heri = require('./patterns/Heri')
Saqoosha = require('./patterns/Saqoosha')
Seki = require('./patterns/Seki')
Sfman = require('./patterns/Sfman')


# window.requestAnimationFrame = Modernizr.prefixed('requestAnimationFrame') or (c) -> window.setTimeout(c, 1000 / 60)



class ShuffledArray

  constructor: (@data) ->
    @prev = -1

  next: =>
    while true
      next = ~~(Math.random() * @data.length)
      if @prev isnt next then break
    @prev = next
    return @data[next]




class Dots


  constructor: (container) ->
    # @renderer = new SVGRenderer()
    @renderer = new WebGLRenderer(container)
    @quadtree = QUAD.init(x: 0, y: 0, w: window.innerWidth, h: innerHeight)
    @currentDots = []
    @currentPattern = null
    @currentColor = r: 255, g: 255, b: 255
    @t = 0

    patterns = new ShuffledArray([Saqoosha, Yusuke, Sfman, Heri, Seki])
    # patterns = new ShuffledArray([Saqoosha, Sfman, Seki])
    colors = new ShuffledArray(['E52B15', '2EB6AB', '60C3E4', 'E62172', 'E7E73A'])
    tr = =>
      @transitionTo(patterns.next(), colors.next()).done ->
        setTimeout(tr, 800)
    tr()

    # setTimeout =>
    #   @transitionTo(Yusuke, Snap.color('#E62172')).done =>
    #     setTimeout =>
    #       @transitionTo(Heri, Snap.color('#E62172'), 10000)
    #     , 1000
    # , 1000

    # @stats = new Stats()
    # document.body.appendChild(@stats.domElement)

    $(window).on('resize', @_onResize)
    setInterval(@_onResize, 1000)
    @_onResize()

    @epoc = Date.now()
    @animate()


  byDistance = (a, b) -> a.dist - b.dist

  transitionTo: (patternClass, nextColor, duration = 350) =>
    delete @currentPattern

    deferred = $.Deferred()

    added = []
    moved = []
    willRemoved = []

    nextPattern = new patternClass()
    nextDots = nextPattern.getDots(window.innerWidth, window.innerHeight)

    @quadtree.clear()
    for dot in nextDots
      obj = 
        x: dot.x - dot.radius
        y: dot.y - dot.radius
        w: dot.radius * 2
        h: dot.radius * 2
        dot: dot
      @quadtree.insert(obj)

    candidates = {}
    nextTaken = {}
    for dot in @currentDots
      minDist = Number.MAX_VALUE
      dot.prev = dot.next
      dot.next = null
      next = null
      r = dot.radius
      r2 = r * 2
      selector = x: dot.x - r, y: dot.y - r, w: r2, h: r2
      @quadtree.retrieve(selector, (node) ->
        dx = dot.x - node.dot.x
        dy = dot.y - node.dot.y
        dist = dx * dx + dy * dy
        d = Math.max(20, dot.radius) + Math.max(20, node.dot.radius)
        if dist < d * d
          candidates[node.dot.id] ?= []
          candidates[node.dot.id].push(dot: dot, dist: dist)
          if dist < minDist
            minDist = dist
            next = node.dot
        )
      if next
        dot.next = next
        if next.prev and nextTaken[next.id]
          willRemoved.push(dot)
        else
          next.prev = dot
          nextTaken[next.id] = true
      else
        dot.next = new Dot(dot.x, dot.y, 0)
        willRemoved.push(dot)

    for dot in nextDots
      prevs = candidates[dot.id]
      if prevs?.length
        prevs.sort(byDistance)
        prev = prevs[0].dot
        if prev.next.id isnt dot.id
          if nextTaken[dot.id]
            willRemoved.push(new Dot(prev.x, prev.y, prev.raius, prev, dot))
          else
            added.push(new Dot(prev.x, prev.y, prev.raius, prev, dot))
            nextTaken[dot.id] = true
      else
        prev = new Dot(dot.x, dot.y, 0)
        added.push(new Dot(dot.x, dot.y, 0, prev, dot))

    # console.log('added', added.length, 'moved', moved.length, 'willRemoved', willRemoved.length)
    dots = @currentDots = @currentDots.concat(added, moved, willRemoved)
    # console.log('current', @currentDots.length)

    @runningPatterns = [@currentPattern, nextPattern]

    @t = 0
    new TWEEN.Tween(this).to(t: 1, duration).easing(TWEEN.Easing.Cubic.InOut).onComplete(=>
        if willRemoved.length
          willRemoved.unshift(@currentDots)
          @currentDots = _.without.apply(null, willRemoved)
        # console.log('current', @currentDots.length)
        @currentPattern = nextPattern
        deferred.resolve()
      ).start()

    nextColor = Snap.color('#' + nextColor)
    new TWEEN.Tween(@currentColor).to(r: nextColor.r, g: nextColor.g, b: nextColor.b, duration).easing(TWEEN.Easing.Cubic.InOut).onUpdate(=>
      @renderer.setColor(@currentColor.r, @currentColor.g, @currentColor.b)
      ).start()

    return deferred.promise()


  animate: =>
    requestAnimationFrame(@animate)

    TWEEN.update()
    @currentPattern?.animate()

    t = @t
    s = 1 - t
    for dot in @currentDots
      prev = dot.prev
      next = dot.next
      dot.x = prev.x * s + next.x * t
      dot.y = prev.y * s + next.y * t
      dot.radius = prev.radius * s + next.radius * t

    @renderer.update(@currentDots)

    # @stats.update()


  windowWidth = windowHeight = -1

  _onResize: =>
    if windowWidth isnt innerWidth or windowHeight isnt innerHeight
      windowWidth = innerWidth
      windowHeight = innerHeight
      @renderer.setSize(innerWidth, innerHeight)


module.exports = Dots
