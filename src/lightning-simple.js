module.exports = drawLightning

function drawLightning (regl) {
  return regl({
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

      uniform sampler2D noise;
      uniform float time;

      varying vec2 v_uv;

      const float falloff = .2;
      const vec3 color = vec3(1.7, 1.48, 1.78);

      void main () {
        vec2 sample0 = vec2(v_uv.x, time * 1.4);
        vec2 sample1 = vec2(v_uv.y * 2. - 1., v_uv.x * .4);
        float turb = texture2D(noise, sample0).x * 2. - 1.;
        float t = clamp(sample1.y * -sample1.y + .15, 0., 1.);
        float y = abs(turb * -t + sample1.x);
        float g = pow(y, falloff);
        vec3 glow = color * -g + color;

        gl_FragColor.rgb = glow * glow * glow;
        gl_FragColor.a = glow.x * glow.x * glow.x;
      }
    `,
    attributes: {
      position: regl.prop('mesh.vertices'),
      uv: regl.prop('mesh.uv')
    },
    uniforms: {
      model: regl.prop('model'),
      noise: regl.prop('noise'),
      time: regl.context('time')
    },
    elements: regl.prop('mesh.indices')
  })
}
