
AFRAME.registerComponent("local-video", {
    init: function () {
        let videoInput1 = document.getElementById("vid-1");
        console.log("vid-1");
        console.log(document.getElementById("vid-1"));
        document.getElementById("start").addEventListener("click", (e) => {
            document.getElementById("init-settings").style.display = "none";
        });

        videoInput1.addEventListener("change", function () {
            const video = this.files[0];
            const url = URL.createObjectURL(video);
            document.getElementById('video-1').setAttribute('src', `${url}`);
            console.log(document.getElementById('video-1'));
        });
    }
})