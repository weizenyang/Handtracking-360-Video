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
      console.log(this.videoSphere.src)
      if(this.videoSphere.src == `#${targetEl.id}`){
        this.videoSphere.src = ""
      } else {
        this.videoSphere.src = `#${targetEl.id}`
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
  