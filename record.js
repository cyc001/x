let mediaRecorder;
let recordedBlobs;
let en_record = 0;
let record_id = 0;
let rec_arr = [];
function handleDataAvailable(event) {
    record_id++; //record_id==2 && 
    if (record_id > 10)
        return;
    if (event.data && event.data.size > 0) {
        //recordedBlobs.push(event.data);
        rec_arr.push(event.data);
    }
    //console.log('handleDataAvailable', event);
}
function startRecording() {
    recordedBlobs = [];
    const mimeType = codecPreferences.options[codecPreferences.selectedIndex].value;
    const options = { mimeType };
    try {
        mediaRecorder = new MediaRecorder(cam_stream_0, options);
    }
    catch (e) {
        console.error('Exception while creating MediaRecorder:', e);
        errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
        return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    recordButton.textContent = 'Stop Recording';
    playButton.disabled = true;
    codecPreferences.disabled = true;
    mediaRecorder.onstop = (event) => {
        if (en_record != 0) {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobs);
            return;
        }
    };
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
    en_record = 1;
    setTimeout(record_loop, 3000);
    console.log('MediaRecorder started', mediaRecorder);
}
function stopRecording() {
    en_record = 0;
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    codecPreferences.disabled = false;
}
function record_loop() {
    mediaRecorder.stop();
    if (record_id > 2) {
        stopRecording();
    }
    if (en_record == 1) {
        mediaRecorder.start();
        setTimeout(record_loop, 2000);
    }
    else {
        console.log('rec end');
    }
}
//# sourceMappingURL=record.js.map