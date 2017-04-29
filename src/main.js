const Regl = require('regl')
const Camera = require('regl-camera')
const Mat4 = require('gl-mat4')
const Quat = require('gl-quat')
const load = require('resl')
const { Quad } = require('./Mesh')
const { Texture } = require('./Load')
const { Renderable } = require('./Renderable')
const DrawLightning = require('./lightning')
const DrawLightningSimple = require('./lightning-simple')
const { PI, sin, cos } = Math
const regl = Regl({
  extensions: [ 'OES_texture_float' ]
})
const camera = Camera(regl, {
  theta: -PI / 2,
  distance: 4
})

const draw = regl({
  vert: `
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 projection;
    uniform mat4 view;
    uniform mat4 model;

    varying vec2 v_uv;

    void main () {
      mat4 mvp = projection * view * model;
      vec4 pos = vec4(position, 1);

      v_uv = uv;
      gl_Position = mvp * pos; 
    } 
  `,
  frag: `
    precision mediump float;

    uniform sampler2D diffuse;

    varying vec2 v_uv;

    void main () {
      vec4 color = texture2D(diffuse, v_uv);

      gl_FragColor = color;
    } 
  `,
  attributes: {
    position: regl.prop('mesh.vertices'),
    uv: regl.prop('mesh.uv')
  },
  uniforms: {
    model: regl.prop('model'),
    diffuse: regl.prop('diffuse')
  },
  elements: regl.prop('mesh.indices')
})

const drawLightningSimple = DrawLightningSimple(regl)
const drawLightning = DrawLightning(regl)

load({
  manifest: {
    noise: {
      type: 'image',
      src: '/textures/perlin_noise.jpg'
    } 
  },
  onDone: function ({ noise }) {
    const noiseTexture = regl.texture({
      data: noise,
      type: 'float',
      wrapS: 'repeat',
      wrapT: 'repeat'
    })
    const quad = new Quad(1, 1)
    const r = new Renderable(quad, [ 0, -.5, 0 ])
    const r2 = new Renderable(quad, [ 0, .5, 0 ])
    const drawParams = {
      mesh: null,
      model: null,
      noise: noiseTexture
    }

    document.body.style.backgroundColor = 'black'
    regl.frame(function () {
      drawParams.mesh = r.mesh
      drawParams.model = r.model
      drawParams.noise = noiseTexture
      Mat4.fromRotationTranslation(r.model, r.rotation, r.position)
      Mat4.fromRotationTranslation(r2.model, r2.rotation, r2.position)
      camera(function () {
        drawParams.mesh = r.mesh
        drawParams.model = r.model
        drawParams.noise = noiseTexture
        drawLightningSimple(drawParams)
        drawParams.mesh = r2.mesh
        drawParams.model = r2.model
        drawLightning(drawParams)
      })
    })
  }
})
