function handleSuccess(stream) {
    db_msg('Media', "suc");
    recordButton.disabled = false;
    // console.log('getUserMedia() got stream:', stream);
    // window.stream = stream;
    cam_stream_0 = stream;
    gumVideo.srcObject = stream;
    getSupportedMimeTypes().forEach(mimeType => {
        const option = document.createElement('option');
        option.value = mimeType;
        option.innerText = option.value;
        codecPreferences.appendChild(option);
    });
    codecPreferences.disabled = false;
}
function handleError(error) {
    db_msg('getUserMedia', "err");
    gumVideo.srcObject = null;
}
function getSupportedMimeTypes() {
    const possibleTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=h264,opus',
        'video/mp4;codecs=h264,aac',
    ];
    return possibleTypes.filter(mimeType => {
        return MediaRecorder.isTypeSupported(mimeType);
    });
}
function cam_init() {
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
        audio: true,
        video: true
    };
    const constraints1 = {
        audio: {
            echoCancellation: { exact: hasEchoCancellation }
        },
        video: {
            width: 480, height: 320
        }
    };
    document.querySelector('button#start').disabled = true;
    //需要在HTTPS/LOCALHOST下才可使用getUserMedia
    navigator.mediaDevices.getUserMedia(constraints).then((ss) => handleSuccess(ss)).catch((err) => handleError(err));
}
//# sourceMappingURL=get_media.js.map