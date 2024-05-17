//---------------------------------------
function get_vint_length(c) {
    var i;
    for (i = 9; c > 0; i--) {
        c = c >> 1;
    }
    return i;
}
function get_vint_value(array, offset, length) {
    var v = array[offset] - (1 << (8 - length));
    for (var i = 1; i < length; i++) {
        v = (v << 8) + array[offset + i];
    }
    return v;
}
function parse_header_size(buffer) {
    var view = new DataView(buffer);
    var array = new Uint8Array(buffer);
    if (view.getUint32(0, false) !== 0x1a45dfa3) {
        throw "EBML Element ID not found";
    }
    if (array[4] === 0) {
        throw "Bad EBML Size";
    }
    var length = get_vint_length(array[4]);
    var ebml_size = get_vint_value(array, 4, length);
    var segment_offset = 4 + length + ebml_size;
    if (view.getUint32(segment_offset, false) !== 0x18538067) {
        throw "Segment Element ID not found";
    }
    var size_length = get_vint_length(array[segment_offset + 4]);
    var offset = segment_offset + 4 + size_length;
    while (view.getUint32(offset, false) != 0x1F43B675) {
        offset += get_vint_length(array[offset]);
        var elem_length = get_vint_length(array[offset]);
        var elem_size = get_vint_value(array, offset, elem_length);
        offset += elem_length + elem_size;
    }
    return offset;
}
function appendBuffers(buffer1, buffer2) {
    var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp;
}
;
function find_first_key_frame(arr) {
    var view = new DataView(arr);
    var a = new Uint8Array(arr);
    var x = 0;
    var t = [0x43, 0xB6, 0x75, 0x01]; //0x1F, 
    //var a = new Uint8Array(buffer);
    for (var i = 0; i < a.length - 20; i++) {
        if (a[i] == t[0] && a[i + 1] == t[1] && a[i + 2] == t[2] && a[i + 3] == t[3]) {
            return i;
        }
    }
    return -1;
}
//var Peer;
//var JsStore;
//var $;
//var jQuery;
//let saveAs;
//let showSaveFilePicker;
///<reference path="jquery.d.ts" />
function str_to_id(a) {
    var n = 0;
    if (a === '')
        return -1;
    for (var i = 0; i < a.length; i++) {
        var k = a.charCodeAt(i);
        if (k > 47 && k < 58) {
            k = k - 48;
        }
        else if (k > 64 && k < 91) {
            k = k - 65 + 10;
        }
        else if (k > 96 && k < 123) {
            k = k - 97 + 10;
        }
        else {
            return -1;
        }
        n += k * (36 ** i);
    }
    return n;
}
function id_to_str(n) {
    var s = '';
    for (;;) {
        var k = n % 36;
        var n = Math.floor(n / 36); // | 0;
        var kkk = n / 36 | 0;
        if (k == 0 && n == 0)
            break;
        if (k < 10) {
            s += k.toString();
        }
        else {
            s += String.fromCharCode(k - 10 + 65);
        }
    }
    return s;
}
function getPhoneModel() {
    var userAgent = navigator.userAgent;
    var s = "";
    if (/(iPhone|iPad|iPod)/i.test(userAgent)) {
        s = "apple";
    }
    else if (/Android/i.test(userAgent) && /Mobile/.test(userAgent)) {
        s = "android";
    }
    else if (/Windows Phone/i.test(userAgent)) {
        s = "micerosoft";
    }
    else if (/Windows NT/i.test(userAgent)) {
        s = "windows";
    }
    else {
        s = "";
    }
    //alert(s);
    return s;
}
function getClipboardContent() {
    var content = "";
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    document.execCommand("paste");
    content = textarea.value;
    document.body.removeChild(textarea);
    return content;
}
async function clip_read() {
    var content = "";
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.focus();
    var tx = document.getElementById("debug");
    tx.focus();
    document.execCommand('paste');
    content = textarea.value;
    document.body.removeChild(textarea);
    return content;
}
async function clip_read1() {
    var rt = null;
    if (typeof navigator == 'undefined' || typeof navigator.clipboard != 'object') {
        return rt;
    }
    await navigator.clipboard.readText().then((data) => {
        rt = data;
        // navigator.clipboard.writeText('123')
    });
    return rt;
    /*
       */
}
/*
// 创建一个新的Promise对象
const readClipboard = new Promise((resolve) => {
    // 判断当前浏览器是否支持Clipboard API
    if (typeof navigator !== 'undefined' && typeof navigator.clipboard === 'object') {
        // 调用Clipboard API的readText()方法获取粘贴板的文本内容
        navigator.clipboard.readText().then(text => resolve(text));
    } else {
        console.error('该浏览器不支持Clipboard API');
        resolve(null);
    }
});*/
async function clip_read0() {
    if (typeof navigator == 'undefined' || typeof navigator.clipboard != 'object') {
        return null;
    }
    var items = null;
    try {
        await navigator.clipboard.read().then(async function (data) {
            items = data; //.items;
            //  navigator.clipboard.write(items);
            for (var i = 0; i < items.length; ++i) {
                if (items[i].types[0].includes('text')) {
                    await navigator.clipboard.readText().then((t) => {
                        items = t;
                    });
                }
                if (items[i].types[0] === 'image/png' || items[i].types[0] === 'image/jpeg') {
                    // 设置图像源为粘贴板中的URL或文件路径
                    // img.src = URL.createObjectURL(items[i]);
                    //     break;
                }
            }
        });
        return items;
    }
    catch (err) {
        return null;
    }
}
function file_array_to_string(a) {
    var v = new Uint8Array(a);
    var s = '';
    for (var i = 0; i < a.byteLength; i++) {
        var c = v[i];
        var c1 = String.fromCharCode((c & 0xf) + 0x30);
        var c2 = String.fromCharCode(((c & 0xf0) / 16) + 0x30);
        s = s + c1 + c2;
    }
    return s;
}
function file_string_to_array(s) {
    var z = s.length / 2;
    var a = new ArrayBuffer(z);
    var v = new Uint8Array(a);
    for (var i = 0; i < z; i++) {
        var c1 = s.charCodeAt(i * 2);
        var c2 = s.charCodeAt(i * 2 + 1);
        c1 = (c1 & 0x0f);
        c2 = (c2 & 0x0f) * 16;
        v[i] = c1 + c2;
    }
    return a;
}
function get_obj_content(obj) {
    var s = '';
    for (let k in obj) {
        if (typeof obj[k] === 'string' || typeof obj[k] === 'number') {
            s += k + ' ' + obj[k] + ', ';
        }
    }
    return s;
}
function getFileName(str) {
    var regExp = /[^\\/]*$/; // 匹配最后一个反斜杠或者斜杠之前的内容
    return str.match(regExp)[0];
}
function clear_debug00() {
    $("#debug").val("");
}
function db_msg0(from, s = '') {
    if (s == '')
        console.log(from + "\r\n");
    else
        console.log(from + ": " + s + "\r\n"); //.innerText
    /*
if (s == '') debug.value += from + "\r\n";
else
    debug.value += from + ": " + s + "\r\n";//.innerText
    */
}
//---------------------------------------------------------------
function hashCode(str) {
    var hash = 0;
    var i, char;
    if (str.length == 0)
        return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}
//base64编码
function encode(input) {
    const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN;
        chr3 = i < input.length ? input[i++] : Number.NaN;
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        }
        else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output +=
            keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
    }
    return output;
}
//-------------------------------------------
///<reference path="no-use.ts" />
///<reference path="alg.ts" />
///<reference path="peerjs.d.ts" />
var svr_id = 'A12345-12345-22345A';
var cons = new Map();
class _Peer_ {
    constructor() {
        this.peer_mode = 'local'; //'';// 'local';
        this.local_peer_js = {
            host: '192.168.0.100',
            key: 'peerjs',
            port: 9000,
            path: "/",
            // referrerPolicy: 'origin-when-cross-origin'
        };
    }
    customGenerationFunction(s) {
        return (s + Math.random().toString(36).substring(2) + "0000000000000000000").substr(0, 16);
    }
    init_peer(_peer_id) {
        if (_peer_id.length < 7) {
            _peer_id = this.customGenerationFunction(_peer_id);
        }
        let _pr;
        if (this.peer_mode == 'local') {
            _pr = new Peer(_peer_id, this.local_peer_js);
        }
        else {
            _pr = new Peer(_peer_id);
        }
        this.pr = _pr;
        _pr.on('open', () => {
            this.on_peer_open(_pr);
        });
        _pr.on('close', () => {
            this.on_peer_close(_pr);
            //this.pr = null;
        });
        _pr.on('disconnected', () => { });
        _pr.on('call', (call) => {
            this.call_answer(call);
            call.on('stream', (remoteStream) => this.call_on_stream(remoteStream));
            call.on('close', () => this.call_close());
            call.on('error', (err) => this.call_err(err));
        });
        _pr.on('connection', (cn) => {
            cons.set(cn.peer, cn);
            this.on_peer_cn_open(cn);
            cn.on('close', () => this.on_peer_cn_close(cn));
            cn.on('error', (err) => this.on_peer_cn_close(cn));
            cn.on('data', (data) => this.on_peer_cn_data(cn, data));
        });
    }
    connect_other(to, other_peer_id, con_on_open, con_on_close, con_on_data) {
        let cn;
        if (this.pr == null)
            return null;
        if (other_peer_id == "") {
            console.log('to _peer_id', 'empty');
            return null;
        }
        cn = this.pr.connect(other_peer_id, { reliable: true });
        cn.on('close', () => {
            cons.delete(cn.peer);
            console.log('peer', 'close');
            con_on_close(cn);
        });
        cn.on('disconnected', () => {
            con_on_close(cn);
        });
        cn.on('error', () => {
            con_on_close(cn);
        });
        cn.on('open', () => {
            cons.set(cn.peer, cn);
            console.log('conn_to_' + to, ' open.');
            con_on_open(cn);
            cn.on('data', (data) => {
                con_on_data(cn, data);
            });
        });
        return cn;
    }
}
///<reference path="../c/_peer.ts" />
class _user_para extends _Peer_ {
    constructor() {
        super();
        this.visibilityState = false;
        //for msg:
        this.msg_id = -1;
        this.peer_id = 'user-';
        this.xid = -1;
        // frame:   
        this.on = false;
        this.x_buf = [];
        this.buffers = [];
        this.frame_id = 0;
        this.ids = { room_xid: -1, rid: -1, xid: -1 };
        //for video:
        this.father_heart_beat_flag = true;
        this.net_speed = [];
        this.has_ask_frame = false;
        this.is_first = true;
        this.neibor = new Neibor();
        this.x_neibor = new Neibor();
        this.wait_frame_member = [];
        this.forword_count = 0;
        this.start_timestamp = 0;
        //debug
        this.endx = [];
        this.idx = [];
    }
}
///<reference path="./_user_para.ts" />
class _user_to_server extends _user_para {
    connect_to_server(_other_peer_id) {
        return this.connect_other('server', _other_peer_id, (cn) => this.to_server_open(cn), (cn) => this.to_server_close(cn), (cn, d) => this.to_server_data(cn, d));
    }
    to_server_data(cn, d) {
        if (d.from == "server") {
            console.log(get_obj_content(d));
            switch (d.c0) {
                case 'login':
                    this.xid = d.xid;
                    this.server = cn;
                    $("#is_online").css("color", "green").text("Online");
                    document.title = from + ' ' + this.xid;
                    if (d.c1 == 'new') {
                        window.localStorage.setItem('room_xid', this.xid.toString());
                        //room_win.postMessage({ from: 'room', c0: 'host', peer: peer.peer_id }, '*');// { w: window, c: 1 }, '*')
                    }
                    else if (d.c1 == 'ok') {
                        //room_win.postMessage({ from: 'room', c0: 'host', peer: peer.peer_id }, '*');
                    }
                    else {
                    }
                    break;
                case 'room_fail':
                    break;
                case 'room_info':
                    this.room_info.set(d.room, d);
                    this.ids = d.ids;
                    this.ids.xid = this.xid;
                    if (cons.has(d.room)) {
                        this.room = cons.get(d.room);
                        this.room.send({ from: 'user', c0: 'join_room', ids: this.ids });
                        if (cons.has(d.host)) {
                            this.host = cons.get(d.host);
                        }
                        else {
                            this.connect_to_host(d.host);
                        }
                    }
                    else {
                        this.room = this.connect_to_room(d.room);
                    }
                    //user.room = new Peer_To_Room('user', 'room', user.pr, d.room);
                    break;
            }
        }
    }
    to_server_open(cn) {
        this.xid = -1;
        var n = window.localStorage.getItem('user_xid');
        if (n) {
            this.xid = parseInt(n);
        }
        let msg = { from: from, c0: "login", xid: this.xid };
        cn.send(msg);
        cn.to = "server";
    }
    ;
    to_server_close(cn) {
    }
    constructor() {
        super();
    }
}
///<reference path="./_user_to_server.ts" />
class _user_peer extends _user_to_server {
    constructor() {
        super();
        this.on_peer_open = (_pr) => {
            $("#is_online").css("color", "green").text("Online_0");
            //db_msg('My peer ID is ' + pr.id);
            $("#my_id").text(_pr.id);
            this.server = this.connect_to_server(svr_id);
            // this.rooms = new Peer_To_Room('user', 'rooms', this.pr, this.rooms_server_id);
        };
        this.on_peer_close = (_pr) => {
            console.log('peer close ');
            $("#is_online").css("color", "black").text("Offline");
            $("#my_id").text('');
        };
        this.on_peer_cn_open = (cn) => { };
        this.on_peer_cn_close = (cn) => { };
        this.on_peer_cn_data = (cn, d) => {
            this.on_conn_data(cn, d);
        };
        this.room_info = new Map();
    }
}
///<reference path="./_user_peer.ts" />
class _user_to_room extends _user_peer {
    constructor() {
        super();
        this.connect_to_room = (_other_peer_id) => {
            return this.connect_other('room', _other_peer_id, (cn) => { this.to_room_open(cn); }, this.to_room_close, (cn, d) => { this.to_room_data(cn, d); });
        };
    }
    to_room_data(cn, d) {
        if (d.from == "room") {
            console.log(get_obj_content(d));
            switch (d.c0) {
                case 'login':
                    var dd = this.room_info.get(cn.peer);
                    this.room.send({ from: 'user', c0: 'join_room', ids: this.ids });
                    if (cons.has(dd.host)) {
                        this.host = cons.get(dd.host);
                    }
                    else {
                        this.connect_to_host(dd.host);
                    }
                    this.mse_init();
                    //cn.xid = d.xid;
                    break;
                case "add_member":
                    //connect_other(peer, d.v0, con_to_room_open, con_to_room_close, con_to_room_data);
                    this.on = true;
                    this.neibor = d.neibor;
                    this.x_neibor = d.x_neibor;
                    this.has_ask_frame = false;
                    this.ids = d.ids;
                    this.ids.xid = this.xid;
                    this.frame_id = -1;
                    this.is_first = true;
                    this.con_to_neibor();
                    $("#xid_label").text('\u00A0\u00A0' + "mse on:" + 'at ' + this.ids.room_xid + '\u00A0\u00A0\u00A0\u00A0    ');
                    break;
                case "refresh_member":
                    this.has_ask_frame = false;
                    this.neibor = d.neibor;
                    this.x_neibor = d.x_neibor;
                    this.con_to_neibor();
                    break;
                case "del_member":
                    break;
                case "room_closed":
                    break;
                case "room_reset_2":
                    this.on = false;
                    //this.reset();
                    this.start_mse(this.ids.room_xid);
                    break;
                case 'msg':
                    var xx;
                    d.msg.forEach((g) => {
                        xx = $('#txt_receive_msg').text();
                        $('#txt_receive_msg').text(xx + g.sender + ':' + g.txt + '\r\n');
                    });
                    break;
                default:
                    console.log('unused info');
                    break;
            }
        }
    }
    to_room_open(cn) {
        let msg = { from: from, c0: "login", xid: this.xid, name: nickname };
        cn.send(msg);
        console.log('conn_to_room ' + 'ok');
        cn.to = "server";
        //	this.server_conn = cn;
    }
    ;
    to_room_close(cn) {
    }
}
///<reference path="../c/mse_alg.ts" />
///<reference path="./_user_to_room.ts" />
const mimeType = 'video/webm; codecs = vp9'; // codecPreferences.options[codecPreferences.selectedIndex].value;
class _user_mse extends _user_to_room {
    constructor() {
        super();
        //updating = false;
        this.buffers = [];
        this.updateend_buffer_count = 0;
        this.started_play = false;
        this.endy = [];
        this.idy = [];
        this.mse_init = () => {
            this.vx = document.getElementById("gum");
            this.vx.addEventListener('waiting', () => {
                this.vx.classList.add('video-buffering');
            });
            this.vx.addEventListener('playing', () => {
                this.vx.classList.remove('video-buffering');
            });
            this.mediaSource = new MediaSource();
            this.vx.src = null;
            this.vx.srcObject = null;
            this.vx.src = URL.createObjectURL(this.mediaSource);
            this.mediaSource.onsourceopen = () => this.sourceOpen();
        };
        // this.init();
    }
    updateend() {
        if (this.ad_playrate()) {
            return;
        }
        //this.updating = false;
        if (!this.started_play) {
            this.updateend_buffer_count += 1;
            if (this.updateend_buffer_count > 2) {
                this.started_play = true;
                this.vx.play();
            }
        }
        this.notify();
    }
    sourceOpen() {
        this.sourceBuffer = this.mediaSource.addSourceBuffer(mimeType);
        this.sourceBuffer.mode = 'sequence';
        this.sourceBuffer.addEventListener("updateend", () => this.updateend());
    }
    notify() {
        if (this.mediaSource.readyState != 'open') {
            return;
        }
        if (this.buffers.length === 0) {
            return;
        }
        if (this.sourceBuffer.updating) {
            return;
        }
        try {
            var buffer = this.buffers.shift();
            if (buffer.end) {
                this.sourceBuffer.abort();
            }
            ;
            this.endy.push(buffer.end);
            this.idy.push(buffer.frame_id);
            // this.updating = true;
            this.sourceBuffer.appendBuffer(buffer.d);
        }
        catch (e) {
            console.log(e.message, " notify 发生异常:");
            return true;
        }
    }
    ad_playrate() {
        try {
            var u = this.sourceBuffer.buffered;
            if (u.length > 0) {
                var t_start = u.start(0);
                var t_end = u.end(0);
                var t_u = t_end - t_start;
                if (this.visibilityState) {
                    this.visibilityState = false;
                    if (t_u > 15 && (t_end - this.vx.currentTime > 15)) {
                        this.vx.currentTime = t_end - 10;
                        //return false;
                    }
                }
                if (this.vx.currentTime < t_start) {
                    this.vx.currentTime = t_start;
                }
                if (t_end - this.vx.currentTime > 30) {
                    this.vx.currentTime = t_end - 1;
                    this.sourceBuffer.remove(t_start, t_end - 2);
                    // console.log('remove_)c', t_start, this.vx.currentTime);
                    return true;
                }
                var t_remain = t_end - this.vx.currentTime;
                if (t_remain < 5)
                    this.vx.playbackRate = 1;
                else if (t_remain > 10)
                    this.vx.playbackRate = 16;
                console.log(this.vx.playbackRate);
                /*
                if (t_remain < 1) this.vx.playbackRate = 1;
                else if (t_remain < 10) this.vx.playbackRate = 1.2;
                else if (t_remain < 20) this.vx.playbackRate = 4;
                else this.vx.playbackRate = 8;

                */
                if (this.vx.currentTime - t_start > 30) {
                    this.sourceBuffer.remove(t_start, this.vx.currentTime - 1);
                    // console.log('remove', t_start, this.vx.currentTime);
                    return true;
                }
                return false;
            }
        }
        catch (e) {
            console.log(e.message, " ad_playrate 发生异常:");
            return true;
        }
    }
}
///<reference path="./_user_mse.ts" />
///<reference path="../c/mse_alg.ts" />
class _user_play extends _user_mse {
    constructor() {
        super();
        this.on_conn_data = async (cn, d) => {
            let m;
            let loc_key_frame;
            var z;
            var dv;
            if (d.c0 == "login") {
                cn.xid = d.xid;
                cn.send({ from: 'host', c0: 'login', xid: this.xid });
                return;
            }
            var iid;
            if (d.ids)
                iid = d.ids;
            else if (d.v0.ids)
                iid = d.v0.ids;
            if ((iid.room_xid != this.ids.room_xid) || (iid.rid != this.ids.rid)) {
                return;
            }
            if (d.from == 'father') {
                if (d.c0 == "new_father") {
                    if (!this.on)
                        return;
                    this.neibor.father = d.v0;
                    this.x_neibor.father = d.v1;
                    var indz = this.neibor.father.indexOf(this.last_ask_peer);
                    if (indz == -1) {
                        if (!this.has_ask_frame) {
                            this.ask_frame(true);
                        }
                        return;
                    }
                }
            }
            if (d.from == 'room_member') {
                this.on_room_member(cn, d);
            }
            if (d.from == 'host') {
                if (d.c0 == "father_heart_beat") {
                    this.father_heart_beat_flag = true;
                    return;
                }
                if (d.c0 == "start_send_a_frame") {
                    this.start_receive_time = new Date().getTime();
                    return;
                }
                if (d.c0 == "no_new_frame") {
                    // db_msg('no new');
                    this.ask_frame(true);
                    return;
                }
                if (d.c0 == "frame_header") {
                    if (d.v0.d != null) {
                        this.frame_header = d.v0;
                        this.is_first = false;
                    }
                    return;
                }
                if (d.c0 == "room_closed") {
                    this.on = false;
                    this.frame_id = -1;
                    this.buffers.splice(0);
                    this.x_buf.splice(0);
                    this.is_first = true;
                    this.wait_frame_member.forEach((b) => {
                        b.cn.send(d);
                    });
                    $("#xid_label").text('\u00A0\u00A0' + "mse off:" + 'at ' + this.ids.room_xid + ':' + this.ids.rid + '\u00A0\u00A0\u00A0\u00A0    ');
                    return;
                }
                if (d.c0 == "video_frame") {
                    this.net_speed.push(new Date().getTime() - this.start_receive_time);
                    if (this.net_speed.length > 20) {
                        this.net_speed.shift();
                        var avg_net_speed = 0;
                        for (var ns = 0; ns < this.net_speed.length; ns++) {
                            avg_net_speed += this.net_speed[ns];
                        }
                        avg_net_speed = avg_net_speed / this.net_speed.length;
                        if (avg_net_speed > 1150) { //150
                            $("#run_info").css("color", "red").text('speed: slow' + avg_net_speed.toString());
                            //  this.server_conn.send({ from: 'user', c0: 'complain', c1: 'i_slow', room_id: this.room_id, v0: this.peer._id })
                            if (this.neibor.son.length > 0) {
                                this.end_mse();
                                this.start_mse(this.ids.room_xid);
                                return;
                            }
                        }
                        else {
                            $("#run_info").css("color", "green");
                        }
                    }
                    this.x_buf.push(d.v0);
                    if (this.x_buf.length > 15)
                        this.x_buf.shift();
                    this.endx.push(d.conti);
                    this.idx.push(d.v0.frame_id);
                    this.send_frame();
                }
                if (!this.on)
                    return;
                if (d.c0 == "video_frame") {
                    if (d.v0.frame_id == this.frame_id + 1) {
                        this.frame_id = d.v0.frame_id;
                        this.buffers.push(d.v0);
                        this.notify();
                        this.ask_frame(d.conti);
                        //  console.log('ok frame' + d.v0.frame_id)
                    }
                    else if (d.v0.frame_id < this.frame_id + 1) {
                        this.ask_frame(d.conti);
                        console.info('repeat frame' + d.v0.frame_id, this.frame_id + 1);
                        //send_continue_video_frame(cn, this.on, z);
                        return;
                    }
                    else if (!d.v0.has_key) {
                        console.log('\x1b[31m err frame \x1b[0m', d.v0.frame_id);
                        // this.is_first = true;
                        // this.frame_id = -1;
                        this.ask_frame(d.conti);
                        return;
                    }
                    else {
                        console.log('\x1b[31m mse reset()\x1b[0m', d.v0.frame_id);
                        this.break_frame_process(d);
                    }
                }
            }
        };
        this.con_to_neibor = () => {
            var f;
            var ff;
            //var neibor: Neibor = this.neibor;
            this.ask_frame(true);
            for (f = 0; f < this.neibor.father.length; f++) {
                ff = this.neibor.father[f];
                if (cons.has(ff)) {
                    if (!this.has_ask_frame) {
                        this.ask_frame(true);
                    }
                }
                else {
                    this.connect_other('father', ff, (cn) => this.con_to_father_open(cn), (cn) => this.con_to_close(cn), (cn, d) => this.on_conn_data(cn, d));
                }
            }
            for (f = 0; f < this.neibor.grand.length; f++) {
                ff = this.neibor.grand[f];
                if (!cons.has(ff)) {
                    this.connect_other('grand', ff, (cn) => this.con_to_grand_open(cn), (cn) => this.con_to_close(cn), (cn, d) => this.on_conn_data(cn, d));
                }
            }
            for (f = 0; f < this.neibor.brother.length; f++) {
                ff = this.neibor.brother[f];
                if (!cons.has(ff)) {
                    this.connect_other('brother', ff, (cn) => this.con_to_brother_open(cn), (cn) => this.con_to_close(cn), (cn, d) => this.on_conn_data(cn, d));
                }
            }
            for (f = 0; f < this.neibor.son.length; f++) {
                ff = this.neibor.son[f];
                if (!cons.has(ff)) {
                    this.connect_other('son', ff, (cn) => this.con_to_son_open(cn), (cn) => this.con_to_close(cn), (cn, d) => this.on_conn_data(cn, d));
                }
                else {
                    cons.get(ff).send({
                        from: 'father', c0: 'new_father', c1: '', v0: this.neibor.brother,
                        v1: this.x_neibor.brother, former: this.neibor.former, ids: this.ids
                    });
                }
            }
        };
        this.connect_to_host = (_other_peer_id) => {
            return this.connect_other('host', _other_peer_id, (cn) => { this.to_host_open(cn); }, this.to_host_close, (cn, d) => this.on_conn_data(cn, d));
        };
        this.start_mse = (_room_xid) => {
            if (this.on)
                return;
            this.endx.length = 0;
            this.endx.length = 0;
            this.x_buf.splice(0);
            this.buffers.splice(0);
            this.frame_id = -1;
            this.is_first = true;
            this.ids.room_xid = _room_xid;
            let msg = { from: 'user', c0: "ask_room", ids: this.ids };
            this.server.send(msg);
        };
        this.end_mse = () => {
            if (!this.on)
                return;
            this.on = false;
            //this.close();
            $("#xid_label").text('\u00A0\u00A0' + "mse off:" + 'at ' + this.ids.room_xid + '\u00A0\u00A0\u00A0\u00A0    ');
            let msg = { from: 'user', c0: "exit_room", ids: this.ids };
            this.room.send(msg);
        };
    }
    break_frame_process(d) {
        this.is_first = false;
        this.frame_id = d.v0.frame_id;
        //this.start_timestamp = d.v1 / 1000.0;
        // this.buffers.push({ d: this.frame_header.d, room_id: this.frame_header.room_id, frame_id: -100, has_key: d.v0.has_key, loc: 0 } as Frame_Content);
        // this.notify();
        if (d.v0.frame_id != 1) {
            var tmp = d.v0.d.slice(d.v0.key_frame_loc);
            d.v0.d = appendBuffers(this.frame_header.d, tmp);
            d.v0.end = true;
        }
        this.buffers.push(d.v0);
        this.notify();
        this.ask_frame(d.conti);
    }
    ask_frame(conti) {
        var f;
        var ff;
        if (!conti)
            return;
        if (!this.on)
            return;
        // var neibor: Neibor = this.neibor;
        var nn = [];
        for (f = 0; f < this.neibor.father.length; f++) {
            ff = this.neibor.father[f];
            if (cons.has(ff)) { //this.pr._connections.has(ff) && 
                nn.push(cons.get(ff));
            }
        }
        let m = {
            from: 'room_member', c0: "get_frame",
            v0: { frame_id: this.frame_id, is_first: this.is_first },
            ids: this.ids
        };
        // let m0 = { from: 'room_member', c0: "login", c1: "in", v0: user.pr.id, room_xid: this.room_xid, rid: this.rid, xid: user_xid };
        switch (nn.length) {
            case 0:
                this.has_ask_frame = false;
                break;
            case 1:
                //   if (!this.got_header) nn[0].send(m0);
                nn[0].send(m);
                this.last_ask_peer = nn[0].peer;
                this.has_ask_frame = true;
                break;
            default:
                var cnn = nn[Math.floor(Math.random() * nn.length)];
                //   if (!this.got_header) cnn.send(m0);
                cnn.send(m);
                this.last_ask_peer = cnn.peer;
                this.has_ask_frame = true;
                break;
        }
    }
    con_to_close(cn) {
    }
    con_to_son_open(cn) {
        if (this.neibor.son.indexOf(cn.peer) != -1) {
            cn.send({
                from: 'father', c0: 'new_father', c1: '', v0: this.neibor.brother,
                v1: this.x_neibor.brother, former: this.neibor.former, ids: this.ids,
            });
        }
    }
    con_to_father_open(cn) {
        if (this.neibor.father.indexOf(cn.peer) != -1) {
            if (!this.has_ask_frame) {
                this.ask_frame(true);
            }
        }
    }
    con_to_brother_open(cn) {
    }
    con_to_grand_open(cn) {
    }
    send_hrbeat_to_son() {
        var gg;
        this.wait_frame_member.forEach((b) => {
            b.cn.send({
                from: 'host', c0: 'father_heart_beat', ids: this.ids
            });
        });
    }
    to_host_open(cn) {
        let msg = { from: from, c0: "login", xid: this.xid };
        cn.send(msg);
        console.log('conn_to_host' + ' ok');
        cn.to = "host";
        this.host = cn;
    }
    ;
    to_host_close(cn) {
    }
    send_frame() {
        this.wait_frame_member.forEach((b) => {
            var is_send = false;
            if (b.cn.get_frame.is_first) {
                b.cn.send({ from: 'host', c0: "frame_header", v0: this.frame_header });
            }
            for (var t = 0; t < this.x_buf.length; t++) {
                if (!is_send) {
                    if (b.cn.get_frame.frame_id < this.x_buf[t].frame_id) {
                        is_send = true;
                    }
                }
                if (is_send) {
                    b.cn.send({
                        from: 'host', c0: 'start_send_a_frame', v0: { frame_id: this.frame_id, ids: this.ids, }
                    });
                    b.cn.send({ from: 'host', c0: 'video_frame', c1: '', v0: this.x_buf[t], conti: t == (this.x_buf.length - 1) });
                    this.forword_count++;
                }
            }
            if (!is_send) {
                b.cn.send({
                    from: 'host', c0: 'no_new_frame', ids: this.ids, frame_id: this.frame_id
                });
            }
        });
        this.wait_frame_member.splice(0);
    }
    on_room_member(cn, d) {
        if (d.from == 'room_member') {
            switch (d.c0) {
                case "get_frame":
                    if (!this.on) {
                        d.from = 'host';
                        d.c0 = 'room_closed';
                        cn.send(d);
                        return;
                    }
                    cn.get_frame = d.v0;
                    cn.xid = d.ids.xid;
                    var w_has = false;
                    for (var w = 0; w < this.wait_frame_member.length; w++) {
                        if (this.wait_frame_member[w].cn.peer == cn.peer) {
                            w_has = true;
                            this.wait_frame_member[w].cn.get_frame = cn.get_frame;
                            break;
                        }
                    }
                    if (!w_has) {
                        if ((d.ids.room_xid == this.ids.room_xid) && (d.ids.rid == this.ids.rid)) {
                            this.wait_frame_member.push({ cn: cn });
                        }
                    }
                    //	this.wait_frame_member.push(cn);
                    break;
            }
        }
    }
    send_msg(msg) {
        if (msg == '' || msg == ' ') {
            return;
        }
        if (this.room) {
            this.room.send({
                from: 'user', c0: 'msg', txt: msg, sender: nickname, ids: this.ids,
                mid: 0
            });
        }
    }
}
class Neibor {
    constructor() {
        this.grand = [];
        this.father = [];
        this.brother = [];
        this.son = [];
    }
}
class Get_Frame_Content {
}
var from = 'user';
var nickname;
var plays = [];
window.onload = () => {
    nickname = "匿名";
    plays[0] = new _user_play();
    plays[0].init_peer(plays[0].peer_id);
    init_ui();
    document.addEventListener('visibilitychange', document_visibilitychange);
};
window.onunload = () => {
    plays[0].end_mse();
    plays[0].pr.destroy();
};
function document_visibilitychange() {
    plays[0].visibilityState = true;
    /*
    if (document.visibilityState == 'visible') {
        var u = play.sourceBuffer.buffered;
        if (u.length > 0) {
            var t_start = u.start(0);
            var t_end = u.end(0)
            if (t_end - 2 > vx.currentTime) {
                vx.currentTime = t_end;
                play.notify();
                return;
            }
            if (t_end - 18 > t_start) {
                play.sourceBuffer.remove(t_start, vx.currentTime - 1);
                return;
            }
        }
    }*/
}
var msgTime = 0;
function init_ui() {
    /*
    $('#txt_receive_msg').on('scroll', () => {
        const dd = document.getElementById('txt_receive_msg');
        dd.scrollTop = Math.round(dd.scrollHeight / 2);
    })*/
    $('#bt_start_watch').click(function () {
        plays[0].start_mse(parseInt($('#room_xid').val()));
        // user.server.send({ from: 'user', to: 'server', c0: 'ask_room', room_xid: parseInt($('#room_id').val()) })
    });
    $('#bt_stop_watch').click(function () {
        plays[0].end_mse();
        // play.room.send({ from: 'user', to: 'room', c0: 'exit_room', room_xid: parseInt($('#room_id').val()),rid:play.room.rid })
    });
    $('#bt_send_msg').click(function () {
        if (Date.now() - msgTime < 2000) {
            return;
        }
        msgTime = Date.now();
        plays[0].send_msg($('#txt_send_msg').val());
        $('#txt_send_msg').val('');
        // play.room.send({ from: 'user', to: 'room', c0: 'exit_room', room_xid: parseInt($('#room_id').val()),rid:play.room.rid })
    });
}
//# sourceMappingURL=index.js.map