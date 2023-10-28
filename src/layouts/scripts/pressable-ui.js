/* global AFRAME, THREE */
AFRAME.registerComponent('pressable', {
    schema: {
      pressDistance: { default: 0.06 },
      hoverDistance: { default: 0.16},
      target: {default: null}
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
        // if(this.data.target == null){
        if(this.data.target){
          distance = this.calculateFingerDistance(handEl.components['hand-tracking-controls'].indexTipPosition);
        } else {
          console.log("tick")
          console.log(this.el.querySelector(this.data.target).object3D)
          //Needs work
          // distance = this.calculateFingerPlaneDistance(handEl.components['hand-tracking-controls'].indexTipPosition, this.el.querySelector(this.data.target).getAttribute('geometry').normal)
        }

        if (distance <= this.data.pressDistance) {
          if (!this.pressed) { this.el.emit('pressedstarted'); }
          this.pressed = true;
          this.hovered = false;
        } else if(distance < this.data.hoverDistance && distance > this.data.pressDistance){
          if (!this.hovered) {
             this.el.emit('hoverstarted') 
            } else {
            this.el.emit('hoverupdate', {"distance": distance});
          }
          this.hovered = true;
        } else {
          if (this.hovered) { this.el.emit('hoverended') }
          if (this.pressed) { this.el.emit('pressedended') }
          this.hovered = false;
          this.pressed = false;
        }
        
      }
      
      // if (this.hovered) { this.el.emit('hoverended') }
      
      
    },
  
    calculateFingerDistance: function (fingerPosition) {
      var el = this.el;
      var worldPosition = this.worldPosition;
  
      worldPosition.copy(el.object3D.position);
      el.object3D.parent.updateMatrixWorld();
      el.object3D.parent.localToWorld(worldPosition);
  
      return worldPosition.distanceTo(fingerPosition);
    },

    calculateFingerPlaneDistance(point, plane) {
      console.log("CFPD")
      console.log(plane)
      var x_o = point.x;
      var y_o = point.y;
      var z_o = point.z;
      var A = plane.x;
      var B = plane.y;
      var C = plane.z;
      var D = -plane.constant;
    
      return Math.abs(A * x_o + B * y_o + C * z_o + D) / Math.sqrt(A * A + B * B + C * C);
    }
  });