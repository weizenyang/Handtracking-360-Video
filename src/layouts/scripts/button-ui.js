/* global AFRAME */
AFRAME.registerComponent('button', {
    schema: {
      label: {default: 'label'},
      width: {default: 0.11},
      toggable: {default: false}
    },
    init: function () {
      var el = this.el;
      var labelEl = this.labelEl = document.createElement('a-entity');
      this.triggerdown = false
      this.intersected = false
      this.color = '#3a50c5';
      // el.setAttribute('geometry', {
      //   primitive: 'box',
      //   width: this.data.width,
      //   height: 0.05,
      //   depth: 0.04
      // });
  
      // el.setAttribute('material', {color: this.color});
      el.setAttribute('pressable', '');
  
      labelEl.setAttribute('position', '0 0 0.02');
      labelEl.setAttribute('text', {
        value: this.data.label,
        color: 'white',
        align: 'center'
      });
  
      labelEl.setAttribute('scale', '0.75 0.75 0.75');
      this.el.appendChild(labelEl);
  
      this.bindMethods();
      
      this.controllers = document.querySelectorAll(".controller").forEach((e) => {
        e.addEventListener("triggerdown", (e) => {
          this.triggerdown = true
          if(this.intersected){
            this.onPressedStarted
          }
        })

        e.addEventListener("triggerup", (e) => {
          this.triggerdown = false
          if(this.intersected){
            this.onPressedEnded
          }
        })
      })
      
      this.el.addEventListener('stateadded', this.stateChanged);
      this.el.addEventListener('stateremoved', this.stateChanged);
      this.el.addEventListener('pressedstarted', this.onPressedStarted);
      this.el.addEventListener('hoverstarted', this.onHoverStarted);
      this.el.addEventListener('hoverended', this.onHoverEnded);
      this.el.addEventListener('pressedended', this.onPressedEnded);
      this.el.addEventListener('raycaster-intersected', (e)=>{
        this.intersected = true
        this.stateChanged
      });
      this.el.addEventListener('raycaster-intersected-cleared', (e) => {
        this.intersected = false
        this.stateChanged
        this.onPressedEnded
      });
    },
  
    bindMethods: function () {
      this.stateChanged = this.stateChanged.bind(this);
      this.onPressedStarted = this.onPressedStarted.bind(this);
      this.onPressedEnded = this.onPressedEnded.bind(this);
    },
  
    update: function (oldData) {
      if (oldData.label !== this.data.label) {
        this.labelEl.setAttribute('text', 'value', this.data.label);
      }
    },
  
    stateChanged: function () {
      // var color = this.el.is('pressed') ? 'green' : this.color;
      // this.el.setAttribute('material', {color: color});
    },
  
    onPressedStarted: function () {
      var el = this.el;
      console.log("Press Started")
      // el.setAttribute('material', {color: 'green'});
      el.emit('click');
      if (this.data.togabble) {
        if (el.is('pressed')) {
          el.removeState('pressed');
        } else {
          el.addState('pressed');
        }
      }
    },

    onHoverStarted: function () {
      var el = this.el;
      console.log("Hover Started")
      console.log(el)
      // el.setAttribute('material', {color: 'green'});
      el.querySelector(".border").object3D.visible = true;
    },

    onHoverEnded: function () {
      var el = this.el;
      // el.setAttribute('material', {color: 'green'});
      console.log("Hover Ended")
      console.log(el)
        el.querySelector(".border").object3D.visible = false;
    },
  
    onPressedEnded: function () {
      if (this.el.is('pressed')) { return; }
      console.log("Press Ended")
      this.el.setAttribute('material', {color: this.color});
    }
  });