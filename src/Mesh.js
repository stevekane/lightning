class Quad {
  constructor( w, h ) {
    var hW = w / 2
    var hH = h / 2

    this.vertices = [
      -hW, -hH, 0,
      hW, -hH, 0,
      hW, hH, 0,
      -hW, hH, 0
    ]
    this.uv = [
      0, 0,
      1, 0,
      1, 1,
      0, 1
    ]
    this.indices = [
      0, 1, 2,
      0, 2, 3
    ]
  }
}

module.exports.Quad = Quad
