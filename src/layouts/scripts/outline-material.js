AFRAME.registerComponent('outline-material', {
    schema: {
        thickness: { type: 'number', default: 0.01 },
        edge: { type: 'number', default: 0.01 },
        radius: {type: 'number', default: 0.01 }
    },

    init() {
        const data = this.data;
        const el = this.el;

        const material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.common,
                THREE.UniformsLib.specularmap,
                THREE.UniformsLib.envmap,
                THREE.UniformsLib.aomap,
                THREE.UniformsLib.lightmap,
                THREE.UniformsLib.emissivemap,
                THREE.UniformsLib.bumpmap,
                THREE.UniformsLib.normalmap,
                THREE.UniformsLib.displacementmap,
                THREE.UniformsLib.gradientmap,
                THREE.UniformsLib.fog,
                {
                    thickness: { value: data.thickness },
                    edge: { value: data.edge },
                    radius: {value: data.radius }
                }
            ]),
            vertexShader: `
        precision highp float;

        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
            fragmentShader: `
        precision highp float;

        uniform float thickness;
        uniform float edge;
        uniform float radius;
        varying vec2 vUv;



        void main() {
            
        vec2 d = fwidth(vUv);
        vec2 a = smoothstep(vec2(thickness - edge), vec2(thickness + edge), vUv); // Calculate the smoothstep function for the left and bottom edges.
        vec2 b = vec2(1.0) - smoothstep(vec2(1.0 - thickness - edge), vec2(1.0 - thickness + edge), vUv); // Calculate the smoothstep function for the right and top edges.
        float sdfValue = length(d * (vec2(min(a.x, b.x), min(a.y, b.y)))); // Calculate the fragment distance.
        gl_FragColor = vec4(sdfValue, 0, 0, alpha);
        }
        
        
        `
        });

        el.getObject3D('mesh').material = material;
    }
});