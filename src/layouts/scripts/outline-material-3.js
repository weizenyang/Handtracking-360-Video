AFRAME.registerComponent('outline-material', {
    schema: {
        thickness: { type: 'number', default: 0.1},
        edge: { type: 'number', default: 0.001 },
        radius: { type: 'number', default: 0.15 },
        color: { type: 'color', default: '#ffffff' },
        alpha: { type: 'number', default: '1.0' },
    },

    init() {
        const data = this.data;
        const el = this.el;
        const material = new THREE.ShaderMaterial({
            uniforms: {
                
                thickness: { value: 1 - this.data.thickness },
                edge: { value: this.data.edge },
                radius: { value: this.data.radius },
                color: { value: new THREE.Color(this.data.color) },
                alpha: { value: this.data.value }
            },
            vertexShader: `
                precision highp float;
        
                varying vec2 vUv;
                varying vec3 color;
                
                
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
            varying vec2 vUv;
            uniform float edge;
            uniform float thickness;
            uniform float radius;
            uniform float alpha;
            varying vec3 color;


            // unsigned round box
            float udRoundBox( vec3 p, vec3 b, float r ) {
                return length(max(abs(p)-b,vec3(0.0)))-r;
              }
              
              float opS( float d1, float d2 ) {
                  return max(-d1,d2);
              }
              
              float udRoundBoxBorder( vec3 p, vec3 b, float r, float borderPercent ) {
                return opS(udRoundBox(p, b*borderPercent, r*borderPercent), udRoundBox(p, b, r));
              }
              
              void main() {
                  vec2 uv = vUv.xy;
                  vec3 boxPosition = vec3(0.5,0.5,0.0);
                  vec3 boxSize = vec3(thickness,thickness,0.0);
                  float boxRounding = radius;
                  vec3 curPosition = vec3(uv, 0.0);    
                  float dist = udRoundBoxBorder(curPosition - boxPosition, boxSize, boxRounding, 0.6);    
                  float THRESHOLD = 0.0001;
                  if (dist <= THRESHOLD){
                    //   gl_FragColor.rgb = vec3(1.0, 1.0, 1.0);
                    // Anti-aliasing
                    float aaFactor = smoothstep(THRESHOLD - edge, THRESHOLD + edge, dist);
                    gl_FragColor.rgba = mix(vec4(vec3(color), alpha), vec4(0), aaFactor);
                    if (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b < 0.5) {
                        discard;
                      }
                  }
              }
            `
        });

        // material.transparent = true;
        // // material.opacity= 0.5
        // material.depthWrite = false; // Disable depth writing
        // material.depthTest = true; // Enable depth testing
        // el.object3D.renderOrder = 0

        el.getObject3D('mesh').material = material;
        
    }
});