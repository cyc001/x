var ws;
var debug;
var codecPreferences;
var errorMsgElement;
var recordButton;
var playButton;
var gumVideo;
var cam_stream_0 = null;
//let cam_stream_1: any = null;
var v0;
var v1;
var rv0;
var rv1;
var rv2;
var peer;
var t_my_id;
var t_server_id;
var r0_id;
var r1_id;
var r2_id;
var bt_id = 0;
function init_vars() {
    codecPreferences = document.querySelector('#codecPreferences');
    errorMsgElement = document.querySelector('span#errorMsg');
    v0 = document.querySelector('video#v_rec_0');
    v1 = document.querySelector('video#v_rec_1');
    recordButton = document.querySelector('button#record');
    playButton = document.querySelector('button#play');
    gumVideo = document.querySelector('video#gum');
    rv0 = document.querySelector('video#rv_0');
    rv1 = document.querySelector('video#rv_1');
    rv2 = document.querySelector('video#rv_2');
    t_my_id = document.getElementById("my_id");
    t_server_id = document.getElementById("server_id");
    r0_id = document.getElementById("r0_id");
    r1_id = document.getElementById("r1_id");
    r2_id = document.getElementById("r2_id");
    document.querySelector('button#start').addEventListener('click', function () { return cam_init(); });
    debug = document.getElementById("debug");
    document.querySelector('button#con_0').addEventListener('click', function () {
        bt_id = 0;
        var call = peer.call(r0_id.value, cam_stream_0);
        call.on('stream', function (remoteStream) {
            // Show stream in some <video> element.
            db_msg('org', "received stream0");
        });
    });
    recordButton.addEventListener('click', function () {
        if (recordButton.textContent === 'Start Recording') {
            startRecording();
        }
        else {
            stopRecording();
        }
    });
    playButton.addEventListener('click', function () {
        play_2s();
    });
}
function db_msg(from, s) {
    debug.value += from + ": " + s + "\r\n"; //.innerText
}
//# sourceMappingURL=vars.js.map