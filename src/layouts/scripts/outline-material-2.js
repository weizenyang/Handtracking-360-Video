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
            uniforms: {
                resolution: { value: new THREE.Vector2() },
                thickness: { value: 0.2 },
                edge: { value: 0.08 },
                radius: { value: 0.0 }
            },
            vertexShader: `
                precision highp float;
        
                varying vec2 vUv;
                
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                precision highp float;
        
                uniform vec2 resolution;
                uniform float thickness;
                uniform float edge;
                uniform float radius;
                varying vec2 vUv;
        
                float roundedFrame (vec2 pos, vec2 size, float radius, float thickness)
                {
                    float d = length(max(abs(vUv - pos),size) - size) - radius;
                    return smoothstep(0.55, 0.45, abs(d / thickness) * 5.0);
                }
                
                void main()
                {
                    vec2 pos = gl_FragCoord.xy / resolution.xy;
                    vec3 frameColor = vec3(1.0);
                    vec2 size = vec2(0.20);
                    float intensity = roundedFrame(pos, size, edge, thickness);
                    vec3 col = mix(vec3(1.0), frameColor, intensity);
                    gl_FragColor = vec4(pos.x, pos.y,0, 1.0);
                }
            `
        });

        el.getObject3D('mesh').material = material;
    }
});