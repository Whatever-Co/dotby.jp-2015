THREE = require('three')


class Background extends THREE.Mesh


  constructor: ->
    @step = Math.max(innerWidth, innerHeight) / 13

    material = new THREE.RawShaderMaterial
      vertexShader: """
        precision mediump float;
        precision mediump int;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        uniform float radius;
        uniform float devicePixelRatio;
        uniform vec2 screenSize;
        uniform vec2 scroll;

        attribute vec3 position;
        attribute vec2 uv;

        varying vec2 vUv;
        varying float vDelta;

        const float th = 3.141592653589793 * 0.25;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv * screenSize - scroll;
          vUv = vec2(vUv.x * cos(th) - vUv.y * sin(th), vUv.x * sin(th) + vUv.y * cos(th));
          vDelta = 1.5 / (radius * devicePixelRatio);
        }
      """
      fragmentShader: """
        precision mediump float;
        precision mediump int;

        uniform float spacing;
        uniform float radius;

        varying vec2 vUv;
        varying float vDelta;

        void main() {
          float dist = distance(mod(vUv, spacing) / spacing, vec2(0.5)) * spacing / radius;
          float alpha = smoothstep(1.0, 1.0 - vDelta, dist);
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.05 * alpha);
        }
      """
      uniforms:
        spacing: type: 'f', value: @step / 1.4
        radius: type: 'f', value: @step * 0.2
        devicePixelRatio: type: 'f', value: window.devicePixelRatio
        screenSize: type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        scroll: type: 'v2', value: new THREE.Vector2(0, 0)
      attributes:
        offset: type: 'v3'
      side: THREE.DoubleSide
      transparent: true
      depthTest: false
      depthWrite: false

    THREE.Mesh.call(this, new THREE.PlaneBufferGeometry(1, 1), material)
    @position.set(window.innerWidth / 2, window.innerHeight / 2, 100)
    @scale.set(window.innerWidth, window.innerHeight, 1)


  animate: (t) ->
    t *= @step * 0.00008
    @material.uniforms.scroll.value.set(t * 5, t * -1.5)


  setSize: (width, height) ->
    @position.set(width / 2, height / 2, 100)
    @scale.set(width, height, 1)

    @step = Math.max(width, height, 800) / 14
    @material.uniforms.spacing.value = @step / 1.4
    @material.uniforms.radius.value = @step * 0.2
    @material.uniforms.screenSize.value.set(width, height)




MAX_NUM_DOTS = 1024


class WebGLRenderer


  constructor: (container) ->
    @camera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 1, 1000)
    @camera.position.z = 500

    @scene = new THREE.Scene()

    @renderer = new THREE.WebGLRenderer(alpha: true, depth: false, stencil: false, antialias: false, devicePixelRatio: window.devicePixelRatio)
    @renderer.setSize(window.innerWidth, window.innerHeight)

#    container = document.getElementById('container')
    container.appendChild(@renderer.domElement)

    @material = new THREE.RawShaderMaterial
      vertexShader: """
        precision mediump float;
        precision mediump int;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        uniform float devicePixelRatio;

        attribute vec3 position;
        attribute vec2 uv;
        attribute vec3 offset; // x,y: pos, z: size

        varying vec2 vUv;
        varying float vDelta;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position * (offset.z) + vec3(offset.xy, 0.0), 1.0);
          vUv = uv;
          vDelta = 1.5 / (offset.z * devicePixelRatio);
        }
      """
      fragmentShader: """
        precision mediump float;
        precision mediump int;

        uniform vec3 color;

        varying vec2 vUv;
        varying float vDelta;

        void main() {
          float dist = length(vUv);
          float alpha = smoothstep(1.0, 1.0 - vDelta, dist);
          gl_FragColor = vec4(color, alpha);
        }
      """
      uniforms:
        devicePixelRatio: type: 'f', value: window.devicePixelRatio
        color: type: 'c', value: new THREE.Color(1, 0, 0)
      attributes:
        offset: type: 'v3'
      side: THREE.DoubleSide
      transparent: true
      depthTest: false
      depthWrite: false

    @geometry = new THREE.BufferGeometry()
    vertices = new Float32Array(9 * 3 * MAX_NUM_DOTS)
    uvs = new Float32Array(9 * 2 * MAX_NUM_DOTS)
    indices = new Uint16Array(8 * 3 * MAX_NUM_DOTS)
    offset = new Float32Array(9 * 3 * MAX_NUM_DOTS)
    s = 1.0
    t = Math.tan(45 / 2 * Math.PI / 180)
    v = [
       0,  0, 0
       s,  t, 0
       s, -t, 0
       t, -s, 0
      -t, -s, 0
      -s, -t, 0
      -s,  t, 0
      -t,  s, 0
       t,  s, 0
    ]
    u = [
       0,  0
       s,  t
       s, -t
       t, -s
      -t, -s
      -s, -t
      -s,  t
      -t,  s
       t,  s
    ]
    for i in [0...MAX_NUM_DOTS]
      vertices.set(v, i * 27)
      uvs.set(u, i * 18)
      j = i * 9
      for k in [0...8]
        indices.set([j, j + 1 + k, j + 1 + (k + 1) % 8], i * 24 + k * 3)
    @geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3))
    @geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    @geometry.addAttribute('index', new THREE.BufferAttribute(indices, 1))
    @geometry.addAttribute('offset', @offset = new THREE.BufferAttribute(offset, 3))

    @zero = (0 for i in [0...9 * 3 * MAX_NUM_DOTS])

    @dots = new THREE.Mesh(@geometry, @material)
    @dots.furstumCulled = false
    @scene.add(@dots)

    @background = new Background()
    @scene.add(@background)

    @epoch = Date.now()



  update: (dots) ->
    offset = @offset.array
    offset.set(@zero)
    for i in [0...Math.min(dots.length, MAX_NUM_DOTS)]
      dot = dots[i]
      j = i * 27
      for k in [0...9]
        offset[j] = dot.x
        offset[j + 1] = dot.y
        offset[j + 2] = dot.radius + 2
        j += 3
    @offset.needsUpdate = true

    @background.animate(Date.now() - @epoch)

    @renderer.render(@scene, @camera)


  setColor: (r, g, b) ->
    @material.uniforms.color.value.setRGB(r / 255, g / 255, b / 255)


  setSize: (width, height) ->
    @camera.right = width
    @camera.bottom = height
    @camera.updateProjectionMatrix()
    @background.setSize(width, height)
    @renderer.setSize(width, height)



module.exports = WebGLRenderer
