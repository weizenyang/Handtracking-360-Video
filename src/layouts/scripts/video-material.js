

    AFRAME.registerComponent('video-material', {
        schema: {
            videoSelector: { type: 'selector' },
            modelSelector: { type: 'selector' }
        },

        init: function() {
            const videoEl = this.data.videoSelector;
            const modelEl = this.data.modelSelector;
            const sceneEl = this.el.sceneEl;
            const videoTexture = new AFRAME.THREE.VideoTexture(videoEl);
            var el = this.el;

            el.addEventListener('click', function() {
                console.log('Play');
                videoEl.play();
                // Add your onclick logic here
            });
            // videoEl.play();


            modelEl.addEventListener('model-loaded', () => {
                const mesh = modelEl.getObject3D('mesh');
                if (!mesh) return;

                mesh.traverse((node) => {
                    if (node.isMesh) {
                        node.material = new AFRAME.THREE.MeshStandardMaterial({ 
                            color: 0xffffff, 
                            map: videoTexture,
                            emissiveMap: videoTexture,
                            side: AFRAME.THREE.DoubleSide
                        });
                        node.material.needsUpdate = true;
                    }
                });
            });

            sceneEl.background = videoTexture;
        }
    });