/* global AFRAME */
AFRAME.registerComponent('event-manager', {

    init: function () {
      this.bindMethods();
  
      this.videoSelector = document.querySelectorAll('.video-selector');
      this.videoSphere = document.querySelector("#videoSphere")
      this.buttonToGeometry = {};

      this.videoSelector.forEach((e) => {
        e.addEventListener('click', this.onClick);
      })
  
      // this.boxButtonEl.addEventListener('click', this.onClick);
      // this.sphereButtonEl.addEventListener('click', this.onClick);
      // this.torusButtonEl.addEventListener('click', this.onClick);
      // this.darkModeButtonEl.addEventListener('click', this.onClick);
      // this.boxButtonEl.addState('pressed');
    },
  
    bindMethods: function () {
      this.onClick = this.onClick.bind(this);
    },
  
    onClick: function (evt) {
      console.log(evt.target)
      var targetEl = evt.target;
      console.log(this.videoSphere.components.material.data.src)
      if(this.videoSphere.components.material.data.src == `#${targetEl.id}`){
        console.log("clear")
        // this.videoSphere.components.material.data.src = ""
        document.querySelector(`sphere-${targetEl.id}`).object3D.scale = "0 0 0"
        document.querySelector(`sphere-${targetEl.id}`).components.material.material.map.image.stop();
      } else {
        console.log("change id")
        document.querySelectorAll("a-videosphere").forEach((e)=> {
          e.object3D.scale = "0 0 0"
          e.components.material.material.map.image.stop();
        })
        document.querySelector(`sphere-${targetEl.id}`).object3D.scale = "1 1 1"
        document.querySelector(`sphere-${targetEl.id}`).components.material.material.map.image.play();
        console.log(this.videoSphere.components.material.data.src)
        console.log("target " + `#${targetEl.id}`)
      }
      
      // if (targetEl === this.boxButtonEl ||
      //     targetEl === this.sphereButtonEl ||
      //     targetEl === this.torusButtonEl) {
      //   this.boxButtonEl.removeState('pressed');
      //   this.sphereButtonEl.removeState('pressed');
      //   this.torusButtonEl.removeState('pressed');
      //   this.boxGeometryEl.object3D.visible = false;
      //   this.sphereGeometryEl.object3D.visible = false;
      //   this.torusGeometryEl.object3D.visible = false;
      //   this.buttonToGeometry[targetEl.id].object3D.visible = true;
      // }
  
      // if (targetEl === this.darkModeButtonEl) {
      //   if (this.el.sceneEl.is('starry')) {
      //     targetEl.setAttribute('button', 'label', 'Dark Mode');
      //     this.el.sceneEl.setAttribute('environment', {preset: 'default'});
      //     this.el.sceneEl.removeState('starry');
      //   } else {
      //     targetEl.setAttribute('button', 'label', 'Light Mode');
      //     this.el.sceneEl.setAttribute('environment', {preset: 'starry'});
      //     this.el.sceneEl.addState('starry');
      //   }
      // } else {
      //   targetEl.addState('pressed');
      // }
    }
  });
  