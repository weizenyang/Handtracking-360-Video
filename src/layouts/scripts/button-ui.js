/* global AFRAME */
AFRAME.registerComponent('button', {
    schema: {
      label: {default: ''},
      textsize: {type: 'number', default: 0.75},
      width: {default: 0.11},
      toggable: {default: false}
    },
    init: function () {
      var el = this.el;
      var labelEl = this.labelEl = document.createElement('a-entity');
      this.triggerdown = false
      this.intersected = false
      this.color = '#3a50c5';
      this.states = {
        HOVER: "hover",
        PRESSED: "pressed",
        NONE: "none"
      }
      this.currentState = null
      this.thickness = 0.0
      this.fade = 0.0
      this.currentThickness = 0.0
      this.currentFade = 0.0
      
      this.currentState
      // el.setAttribute('geometry', {
      //   primitive: 'box',
      //   width: this.data.width,
      //   height: 0.05,
      //   depth: 0.04
      // });
  
      // el.setAttribute('material', {color: this.color});
      el.setAttribute('pressable', 'target: .background');
  
      labelEl.setAttribute('position', '0 0 0.02');
      labelEl.setAttribute('text', {
        value: this.data.label,
        color: 'white',
        align: 'center',

      });

      // this.hoverSound = document.createElement('a-sound');
      // this.hoverSound.setAttribute("src","src: url(/Hover.mp3)")
      // console.log(this.hoverSound.src)
      // el.appendChild(this.hoverSound)
      
      
      
      // this.pressStartSound = document.createElement('a-sound');
      // this.pressStartSound.setAttribute("src","src: url(/PressStart.mp3)")
      // this.pressStartSound.setAttribute("volume","1")
      // el.appendChild(this.pressStartSound)

      // this.pressEndSound = document.createElement('a-sound');
      // this.pressEndSound.setAttribute("src","src: url(/PressEnd.mp3)")
      // el.appendChild(this.pressEndSound)
      // <a-sound src="src: url(/Hover.mp3)" autoplay="true" position="0 2 5"></a-sound>

      
  
      labelEl.setAttribute('scale', `${this.data.textsize} ${this.data.textsize} ${this.data.textsize}`);
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

      // setInterval((e) => {
      //   this.el.emit("hoverstarted")
      // }, 10000)
      
      this.el.addEventListener('stateadded', this.stateChanged);
      this.el.addEventListener('stateremoved', this.stateChanged);
      this.el.addEventListener('pressedstarted', this.onPressedStarted);
      this.el.addEventListener('hoverstarted', this.onHoverStarted);
      this.el.addEventListener('hoverupdated', this.onHoverUpdated);
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
      this.onHoverStarted = this.onHoverStarted.bind(this);
      this.onHoverEnded = this.onHoverEnded.bind(this);
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
      // this.currentState = this.states.PRESSED;
      this.thickness = 0.50
      this.fade = 0.01
      if(this.el.hasAttribute('sound')){
        this.el.removeAttribute('sound')
      }
      el.setAttribute('sound', 'src: #pressStart; autoplay: true; volume: 3')

      if(this.el.id == "hide-menu"){
        if(document.getElementById('menu').object3D.scale.x < 1){
          document.getElementById('hide-menu').setAttribute('button', 'label: Hide')
          document.getElementById('menu').setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1;')
        } else {
          document.getElementById('hide-menu').setAttribute('button', 'label: Show')
          document.getElementById('menu').setAttribute('animation', 'property: scale; to: 0 0 0; from: 1 1 1;')
        }
      }
      // el.querySelector(".border").setAttribute("visible", "true")
      // el.querySelector(".border").setAttribute(`outline-material`, `thickness: ${currentThickness}; edge: 0.01`)
      // el.setAttribute('material', {color: 'green'});
      // this.hoverSound.components.sound.stopSound();
      // this.playStartSound.components.sound.playSound();
      // this.playEndSound.components.sound.stopSound();
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
      var el = this;
      console.log("Hover Started")
      // console.log(this)
      // el.setAttribute('material', {color: 'green'});
      // el.querySelector(".border").setAttribute("outline-material", "thickness: 0.35; edge: 0.15")
      // el.querySelector(".border").setAttribute("visible", "true")
      if(this.el.hasAttribute('sound')){
        this.el.removeAttribute('sound')
      }

      
      this.el.setAttribute('sound', 'src: #hover; autoplay: true; volume: 3')
      this.thickness = 0.45
      this.fade = 0.01
      // this.currentState = this.states.HOVER;
    },

    onHoverUpdated: function (e) {
      var el = this;
      // console.log("Hover Started")
      // console.log(this)
      console.log(e)
      // el.setAttribute('material', {color: 'green'});
      // el.querySelector(".border").setAttribute("visible", "true")
    },

    onHoverEnded: function () {
      var el = this;
      // el.setAttribute('material', {color: 'green'});
      console.log("Hover Ended")
      // console.log(this)
      // this.currentState = this.states.NONE;
      this.thickness = 0.0
      this.fade = 0.0
    },
  
    onPressedEnded: function () {
      var el = this.el;
      
      if (this.el.is('pressed')) { return; }
      console.log("Press Ended")
      if(this.el.hasAttribute('sound')){
        this.el.removeAttribute('sound')
      }
      if(this.el.id == "clear"){
        this.el.setAttribute('animation', 'property: scale; from: 1 1 1; to: 0 0 0;  dur: 500; easing: easeInOutQuad')
        if(document.getElementById('hide-menu').object3D.scale.x > 0){
          document.getElementById('hide-menu').setAttribute('animation', 'property: scale; to: 0 0 0; from: 1 1 1; dur: 500; easing: easeInOutQuad')
          document.getElementById('hide-menu').setAttribute('animation__2', 'property: position; from: 0.0 -0.4 0; to: 0.0 -0.8 0; dur: 500; easing: easeInOutCubic')
        }
        
      }
      
      
      el.setAttribute('sound', 'src: #pressEnd; autoplay: true; volume: 3')
      // this.hoverSound.components.sound.stopSound();
      // this.playStartSound.components.sound.stopSound();
      // this.playEndSound.components.sound.playSound();
      // el.querySelector(".border").setAttribute("slice9", "opacity: 0.0")
      // el.querySelector(".background").setAttribute("slice9", "opacity: 0.50")
      // this.currentState = this.states.NONE;
      this.thickness = 0.0
      this.fade = 0.0
      this.el.setAttribute('material', {color: this.color});
    }, 
    tick(){
      var el = this.el;
      
      //   console.log(this.currentState)
      // if(this.currentState == "none"){
      //   this.thickness = 0.0
      //   this.fade = 0.0
      // } else if(this.currentState == "hover"){
      //   console.log("HOVER")
      //   this.thickness = 0.55
      //   this.fade = 0.01
      // } else if(this.currentState == "pressed"){
      //   // console.log("PRESSED")
      //   this.thickness = 0.45
      //   this.fade = 0.01
      // }
      // console.log(`Target ${this.thickness} ${this.fade}`)
      if(Math.abs(this.thickness - this.currentThickness) > 0.001 || Math.abs(this.currentFade - this.fade) > 0.001 ){
        console.log("updating")
      this.currentThickness += (this.thickness - this.currentThickness) * 0.5
      this.currentFade += (this.fade - this.currentFade) * 0.5
      if(el.querySelector(".border")){
        this.att = el.querySelector(".border").getAttribute(`outline-material`)
        console.log(this.att)
        // el.querySelector(".border").setAttribute(`outline-material`, `thickness`, this.currentThickness)
        el.querySelector(".border").setAttribute(`outline-material`, `thickness: ${this.currentThickness}; edge: ${this.currentFade};`)
        console.log(this.currentThickness)
      }
      }
      
      
    }

    
  });