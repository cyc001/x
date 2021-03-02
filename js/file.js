   let file = null;
        let video =   document.querySelector('video#recorded');
        //let mimeCodec = 'video/mp4; codecs="avc1.640028, mp4a.40.2"';
		let mimeCodec = 'video/webm;codecs=vp9,opus';
        let i = 0;
		let mediaSource;
		let sourceBuffer;
		let x_buf;
		let flag=0;
        document.getElementById('file').onchange = function(){
          file = this.files[0];
          //一个视频分成3段 首先这个视频要大于30*1024*1024,结尾是file.size
          let blob = file.slice(0,10*1024*1024);
          let blob2 = file.slice(1*1024*1024,2*1024*1024);
          let blob3 = file.slice(2*1024*1024,3*1024*1024);
		  
		    mediaSource = new MediaSource();
          //video.src 通过 URL.createObjectURL 链接 mediaSource
          video.src = URL.createObjectURL(mediaSource);
          //mediaSource设置监听打开链接
          mediaSource.addEventListener('sourceopen', sourceOpen);
          function sourceOpen(){
           
          //  let mediaSource = this;
            //创建sourceBuffer
             sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
			 sourceBuffer.mode='sequence';
            //sourceBuffer监听数据更新updateend
            sourceBuffer.addEventListener('updateend', function (_) {
			if(flag==0){
			sourceBuffer.appendBuffer(x_buf);
			flag++;
			}
			else{
                 //  mediaSource.endOfStream();
                  URL.revokeObjectURL(video.src);
				    video.play();
				}
				});
		  
		        fetchAB(blob, function (buf) {
             // console.log(sourceBuffer.appendBuffer);
             // sourceBuffer.appendBuffer(buf);
			 var arr=[];
			 arr.push(buf);
			  const superBuffer = new Blob(arr, { type: 'video/webm' });
			  //  video.src = null;
				//video.srcObject = null;
				
				// recordedVideo.controls = true;
				//video.src = window.URL.createObjectURL(superBuffer);
				//video.play();
				x_buf=buf;
				sourceBuffer.appendBuffer(buf);
            });
			}
			return;

        }
		
				  function ccbb(buf) {
                    console.log(sourceBuffer.appendBuffer);
                    sourceBuffer.appendBuffer(buf);
                  }
          function fetchAB (file, cb) {
            let reader = new FileReader();
            reader.onload = function(e){
              console.log(e.target.result);
              cb(e.target.result);
            }
            reader.readAsArrayBuffer(file);
           
          }		 