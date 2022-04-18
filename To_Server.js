function connect_other(_peer, _peer_id, _peer_type) {
    let con;
    if (_peer == null)
        return;
    if (_peer_id == "") {
        db_msg('to _peer_id', 'empty');
        return;
    }
    db_msg('to _peer_id', 'begin conn');
    r1_id.value = _peer_id;
    con = _peer.connect(_peer_id);
    con.on('close', function () {
        db_msg('peer', 'close');
    });
    con.on('disconnected', function () {
        db_msg('peer', 'disconnected');
        con_map.delete(con.peer);
    });
    con.on('error', function () {
        db_msg('peer', 'error');
    });
    con.on('open', function () {
        /*
        //let str;
        let IP = '';
        let reg = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
        let ipx: string;

        ipx = con.peerConnection.localDescription.sdp;
        ipx.split('\n').forEach((str) => {
            if (str.charAt(0) == 'o') {
                let s = reg.exec(str);
                if (s && s.length > 1) {
                    IP = s[1];
                }
            }
        });

        if (IP != '') {
            db_msg('IP0', IP);
        }


        ipx = con.peerConnection.remoteDescription.sdp;
        ipx.split('\n').forEach((str) => {
            if (str.charAt(0) == 'o') {
                let s = reg.exec(str);
                if (s && s.length > 1) {
                    IP = s[1];
                }
            }
        });

        if (IP != '') {
            db_msg('IP', IP);
            (document.querySelector('video#test_v0') as HTMLVideoElement).src = 'http://' + IP + '/3.mp4';
        }
        */
        con_map.set(con.peer, con);
        if (_peer_type == 'to server') {
            let msg = { "c": "login", "c1": "in", "v": _peer.id };
            con.send(JSON.stringify(msg));
            db_msg('server', 'conn ok');
            peer.server_conn = con;
        }
        // Receive messages
        con.on('data', function (data) {
            if (p_as_web(data, con)) {
                return;
            }
            if (_peer_type == 'to server') {
                p_server_msg(data);
                console.log('Received', data);
                db_msg('peer', data);
            }
            else {
                if (data.c == 'close') {
                    con_map.delete(con.peer);
                    con.close();
                }
            }
        });
    });
    return con;
}
/*
function connect_server() {

    if (server_id == "") {
        db_msg('server_id', 'empty');
        return;
    }
    db_msg('to server', 'begin conn');

    peer.server_id = server_id;
    t_server_id.value = peer.server_id;


    peer.server_conn = peer.connect(peer.server_id);

    peer.server_conn.on('close', function () {
        db_msg('peer', 'close');
    });
    peer.server_conn.on('disconnected', function () {
        db_msg('peer', 'disconnected');
    });
    peer.server_conn.on('error', function () {
        db_msg('peer', 'error');
    });

    peer.server_conn.on('open', function () {
        let msg: Object = { "c": "login", "c1": "in", "v": peer.id };
        peer.server_conn.send(JSON.stringify(msg));
        db_msg('server', 'conn ok');
        // Receive messages
        peer.server_conn.on('data', function (data) {

            p_server_msg(data);
            console.log('Received', data);
            db_msg('peer', data);
        });

    });
}

*/
function fetch_stream(url, obj, con) {
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'blob'; // 'arraybuffer';
    xhr.onload = function () {
        // cb(xhr.response);
        // xhr.response
        obj.stream = xhr.response;
        con.send(obj);
    };
    xhr.send();
}
function p_as_web(ss, con) {
    var s = JSON.parse(ss);
    // host_dir = '127.0.0.1' + s.page;
    host_dir = 'file://' + s.page;
    // host_dir = 'file://e:/1' + s.page;
    if (s.c == 'req_web_page' || s.c == 'req_web_res') {
        s.web_peer_id = con.peer;
        // ws.send_obj(s);
        if (s.c == 'req_web_page')
            s.c = 'answer_web_page';
        if (s.c == 'req_web_res')
            s.c = 'answer_web_res';
        fetch_stream(host_dir, s, con);
        return true;
    }
    if (s.c == 'answer_web_page' || s.c == 'answer_web_res') {
        // s.web_peer_id = con.peer_id;
        ws.send(ss); /*
        if (s.dir == 'reader to lib') {
            s.dir = 'lib to reader'
            fetch_stream(host_dir, s, con);
        }
        else {
            ws.send_obj(s);
        }*/
        return true;
    }
    return false;
}
function p_server_msg(s) {
    var m = JSON.parse(s);
    if (m['c'] == 'send_video') {
        db_msg('rec', "send_video");
        const call = peer.call(m['c1'], cam_stream_0);
        call.on('stream', (remoteStream) => {
            // Show stream in some <video> element.
            db_msg('org', "received stream0");
        });
        return;
    }
    db_msg('rec', m['c']);
    peer.server_conn.send(s);
    if (m['c'] == 'login') {
        if (m['c1'] == 'ok') {
            db_msg('peer login ok', m['v']);
            return;
        }
        return;
    }
    if (m['c'] == 'broad') {
        if (m['c1'] == 'id') {
            peer.live_room_id = m['v'];
            db_msg('peer live_room_id', m['v']);
            return;
        }
        if (m['c1'] == 'room_list') {
            db_msg('room_list', m['v1']);
            //connect_room_host(m['v']);
            return;
        }
        if (m['c1'] == 'add_people') {
            // viewer.add()
            var call = peer.peer.call(m['v'], cam_stream_0);
            db_msg('peer add_people', m['v']);
            return;
        }
        return;
    }
}
//# sourceMappingURL=To_Server.js.map