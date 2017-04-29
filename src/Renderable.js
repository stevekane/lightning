var Mat4 = require('gl-mat4')
var Vec3 = require('gl-vec3')
var Quat = require('gl-quat')

class Renderable {
  constructor( mesh, position ) {
    this.mesh = mesh
    this.model = Mat4.create()
    this.position = position
    this.rotation = Quat.create()
  }

  update() {
    Mat4.fromRotationTranslation(this.model, this.rotation, this.position) 
  }
}

module.exports.Renderable = Renderable
