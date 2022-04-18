let ws;
let con_map;
let ws_tasks;
let host_dir;
let debug;
let codecPreferences;
let errorMsgElement;
let recordButton;
let playButton;
let gumVideo;
let cam_stream_0 = null;
//let cam_stream_1: any = null;
let v0;
let v1;
let rv0;
let rv1;
let rv2;
let peer;
let t_my_id;
let t_server_id;
let r0_id;
let r1_id;
let r2_id;
let bt_id = 0;
function init_vars() {
    con_map = new Map();
    ws_tasks = [];
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
    document.querySelector('button#start').addEventListener('click', () => cam_init());
    debug = document.getElementById("debug");
    document.querySelector('button#con_0').addEventListener('click', () => {
        bt_id = 0;
        const call = peer.call(r0_id.value, cam_stream_0);
        call.on('stream', (remoteStream) => {
            // Show stream in some <video> element.
            db_msg('org', "received stream0");
        });
    });
    document.querySelector('button#con_2').addEventListener('click', () => {
        //  let msg: Object = { "c": "file", "c1": "3.mp4" };
        //  ws.send(JSON.stringify(msg));
        //fetchAB('http://localhost/3.mp4', process_blob);
        fetchAB('http://localhost/2.jpg', process_blob);
    });
    recordButton.addEventListener('click', () => {
        if (recordButton.textContent === 'Start Recording') {
            startRecording();
        }
        else {
            stopRecording();
        }
    });
    playButton.addEventListener('click', () => {
        play_2s();
    });
    setInterval(send_ws_info_to_peer, 100);
}
function send_ws_info_to_peer() {
    ws_tasks.forEach((tt, i) => {
        var t = JSON.parse(tt);
        if (con_map.has(t.web_peer_id)) {
            con_map.get(t.web_peer_id).send(tt);
            // con_map.delete(t.web_peer_id);
            ws_tasks.splice(i, 1);
        }
    });
}
function db_msg(from, s) {
    debug.value += from + ": " + s + "\r\n"; //.innerText
}
function fetchAB(url, cb) {
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'blob'; // 'arraybuffer';
    xhr.onload = function () {
        cb(xhr.response);
        // xhr.response
    };
    xhr.send();
}
function process_blob(b) {
    //   (document.getElementById("test_img") as HTMLImageElement).src = window.URL.createObjectURL(b);
    // rv2.src = window.URL.createObjectURL( b);
    //  ws.send_obj({ 'c': 'filex', 'stream': b });
    var reader = new FileReader();
    reader.onload = function (event) {
        var content = reader.result; //内容就在这里
        ws.send_obj({ 'c': 'filex', 'stream': content });
    };
    reader.readAsText(b);
}
//# sourceMappingURL=vars.js.map