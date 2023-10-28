

AFRAME.registerComponent('outline-material', {
    schema: {
        thickness: { type: 'number', default: 0.1 },
        edge: { type: 'number', default: 0.001 },
        radius: { type: 'number', default: 0.15 },
        color: { type: 'color', default: '#ffffff' },
        alpha: { type: 'number', default: 1.0 },
        map: { type: 'string' }
    },

    init() {
        const data = this.data;
        const el = this.el;
        this.texture = null

        const loader = new THREE.TextureLoader();
        console.log(this.data)
        if(this.data.map != ""){
            loader.load(this.data.map,
                // onLoadCallback
                (texture) => {
                    this.texture = texture;
                    this.update()
                },
                // onProgressCallback - not sure if working
                undefined,
                // onErrorCallback
                function (err) {
                    console.log(err);
                    
                }
            );
        }
        
    },
    update: function () {
        const data = this.data;
        const el = this.el;
        
        // const loader = new THREE.TextureLoader();
        // console.log(this.data.map)
        // loader.load(this.data.map,
        //     // onLoadCallback
        //     (texture) => {
        //         console.log(texture)
        //     },
        //     // onProgressCallback - not sure if working
        //     undefined,
        //     // onErrorCallback
        //     function (err) {
        //         console.log(err);
        //     }
        // );
        if(this.texture != null || this.texture != undefined || this.texture != ""){
            console.log(this.texture)
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    thickness: { value: 1 - data.thickness },
                    edge: { value: data.edge },
                    radius: { value: data.radius },
                    color: { value: new THREE.Color(data.color) },
                    alpha: { value: data.alpha },
                    map: { value: this.texture } // Assign the loaded texture here
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
                    uniform sampler2D map;
        
        
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
                          vec4 texel = texture2D(map, vUv);
                          vec3 modifiedColor = texel.rgb * vec3(0.6);
    
                          // Create a new variable to store the modified color
                            float aaFactor = smoothstep((THRESHOLD - edge), THRESHOLD + edge, dist);
                            gl_FragColor.rgba = mix(vec4(vec3(1.0, 1.0, 1.0), alpha), vec4(modifiedColor, 1.0), aaFactor);
                      }
                            `
            });
    
            // Set the material on the entity
            el.getObject3D('mesh').material = material;
        }
        
      }
});