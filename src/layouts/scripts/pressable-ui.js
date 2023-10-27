/* global AFRAME, THREE */
AFRAME.registerComponent('pressable', {
    schema: {
      pressDistance: { default: 0.06 },
      hoverDistance: { default: 0.11}
    },
  
    init: function () {
      this.worldPosition = new THREE.Vector3();
      this.handEls = document.querySelectorAll('[hand-tracking-controls]');
      this.pressed = false;
      this.hovered = false;
    },
  
    tick: function () {
      var handEls = this.handEls;
      var handEl;
      var distance;
      for (var i = 0; i < handEls.length; i++) {
        handEl = handEls[i];
        distance = this.calculateFingerDistance(handEl.components['hand-tracking-controls'].indexTipPosition);
        console.log(distance)
        if (distance < this.data.pressDistance) {
          if (!this.pressed) { this.el.emit('pressedstarted'); }
          this.pressed = true;
          this.hovered = false;
          return;
        } else if(distance < this.data.hoverDistance){
          if (!this.hovered) { this.el.emit('hoverstarted', {"distance": distance}); } 
          else {
            this.el.emit('hoverupdate', {"distance": distance});
          }
          this.hovered = true;
        } else{
          this.hovered = false;
        }
      }
      if (this.pressed) { this.el.emit('pressedended'); }
      if (this.hovered) { this.el.emit('hoverended'); }
      this.pressed = false;
      
    },
  
    calculateFingerDistance: function (fingerPosition) {
      var el = this.el;
      var worldPosition = this.worldPosition;
  
      worldPosition.copy(el.object3D.position);
      el.object3D.parent.updateMatrixWorld();
      el.object3D.parent.localToWorld(worldPosition);
  
      return worldPosition.distanceTo(fingerPosition);
    }
  });