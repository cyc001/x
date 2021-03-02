const playmButton = document.querySelector('button#play_blob');
playmButton.addEventListener('click', () => {
    mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource); //URL.createObjectURL(b1[0]);//
    mediaSource.addEventListener('sourceopen', sourceOpen);
});

var z=0;
function sourceOpen() {
        //console.log(this.readyState); // open
        //  var mediaSource=this;
        sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        //sourceBuffer.mode = 'sequence';
        sourceBuffer.addEventListener('updateend', sourceBuffer_end);
		
	//	recordedBlobs.splice(2,2);
	z=0;
var a=[];
a.push(recordedBlobs[z]);
        const s1 = new Blob(a, { type: 'video/webm' });
        fetchAB(s1, function (buf) {
            //  console.log(sourceBuffer.appendBuffer);
            sourceBuffer.appendBuffer(buf);
        });
    }


function sourceBuffer_end() {
    //  mediaSource.duration = 3;
    //  mediaSource.endOfStream();
   // URL.revokeObjectURL(video.src);
   z++;
   if(recordedBlobs.length<=z){
	   URL.revokeObjectURL(video.src);
	   return;
   }
   if(z==3){
	 //  z++;
   }
   var a=[];
a.push(recordedBlobs[z]);
        const s1 = new Blob(a, { type: 'video/webm' });
        fetchAB(s1, function (buf) {
            //  console.log(sourceBuffer.appendBuffer);
            sourceBuffer.appendBuffer(buf);
        });
   if(z==1)
    video.play();
    // recordedVideo.currentTime = 0;
}