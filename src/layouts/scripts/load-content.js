AFRAME.registerComponent('load-content', {
    init: function(){
    document.querySelectorAll('video').forEach((e) => {
        console.log('Load listener added')
        e.addEventListener('loadeddata', (e) => {
            console.log(e)
    })
            // if (this.readyState === 4) {
            //   console.log('The video is fully loaded!');
            // }
          });
        // this.video = this.el.getAttribute('src')
        // console.log('load content')
        // console.log(this.el.getAttribute('src'))
        // this.video.load()
        
    }, tick(){
        // console.log(this.video.readyState)
    }
})