/* global AFRAME, THREE */
AFRAME.registerComponent('pressable', {
    schema: {
      pressDistance: { default: 0.05 },
      hoverDistance: { default: 0.16},
      target: {default: null}
    },
  
    init: function () {
      this.worldPosition = new THREE.Vector3();
      this.handEls = document.querySelectorAll('[hand-tracking-controls]');
      this.pressed = [false, false];
      this.hovered = [false, false];
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

        if(distance <= this.data.pressDistance){
          if (!this.pressed[i]){
            this.el.emit('pressedstarted', {"hand": i});
            this.pressed[i] = true;
          }
        } else if(distance < this.data.hoverDistance && distance > this.data.pressDistance){
          if (!this.hovered[i]) {
            this.el.emit('hoverstarted', {"hand": i})
            this.hovered[i] = true;
          }
        } else if(distance > this.data.hoverDistance){
          if (this.hovered[i]) { this.el.emit('hoverended', {"hand": i}) }
          if (this.pressed[i]) { this.el.emit('pressedended', {"hand": i}) }
            this.hovered[i] = false;
            this.pressed[i] = false;
        }
      }

      //   if (distance <= this.data.pressDistance) {
      //     if (!this.pressed[i]) { this.el.emit('pressedstarted'); }
      //     this.pressed[i] = true;
      //     this.hovered[i] = false;
      //   } else if(distance < this.data.hoverDistance && distance > this.data.pressDistance){
      //     if (!this.hovered[i]) {
      //        this.el.emit('hoverstarted')
      //        this.hovered[i] = true;
      //       } else {
      //       this.el.emit('hoverupdate', {"distance": distance});
      //     }
          
      //   } else if(distance > this.data.hoverDistance){
          
      //     this.hovered[i] = false;
      //     this.pressed[i] = false;
      //   }
        
      // }
      // if (!this.hovered[0] && !this.hovered[1]) { this.el.emit('hoverended') }
      // if (!this.pressed[0] && !this.pressed[1]) { this.el.emit('pressedended') }
      
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