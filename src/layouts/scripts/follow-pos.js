AFRAME.registerComponent('follow-pos', {
    schema:{
        target: {type: 'string'},
        step: {type: 'number', default: 0.7},
        height: {type: 'number', default: 1.1},
        speed: {type: 'number', default: 0.01},
    },
    init: function (){
        // console.log("Follow Pos")
        
        this.target = document.querySelector(this.data.target)
        this.height = this.data.height
        this.targetWorldSpace = new THREE.Vector3()
        this.elWorldSpace = new THREE.Vector3()
        this.filteredWorldSpace = new THREE.Vector3()

        
        console.log(this)
        console.log(this.target)
    },
    tick: function (){
        

        this.el.object3D.getWorldPosition(this.elWorldSpace)
        this.elWorldSpace.y = this.height

        this.target.object3D.getWorldPosition(this.targetWorldSpace)
        this.targetWorldSpace.y = this.height
        

        // console.log(this.elWorldSpace)
        // console.log(this.elWorldSpace)
        // console.log(this.elWorldSpace.distanceTo(this.targetWorldSpace))
        // console.log(this.filteredWorldSpace)
        
        
        
        
        if(this.elWorldSpace.distanceTo(this.targetWorldSpace) > this.data.step){
            console.log(this.elWorldSpace.distanceTo(this.targetWorldSpace))
            this.filteredWorldSpace.copy(this.targetWorldSpace)
            this.filteredWorldSpace.y = this.height
        }

        this.el.object3D.position.lerp(this.filteredWorldSpace, this.data.speed)
        
    }
})