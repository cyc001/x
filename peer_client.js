let peer_count = 0;
function init_peer(_srv_id, _peer_id = '') {
    let pr;
    switch (_srv_id) {
        case 1:
            //npm install peer -g
            //peerjs --port 9000 --key peerjs --path /myapp
            if (_peer_id == '') {
                pr = new Peer({
                    key: 'peerjs',
                    secure: false,
                    host: '127.0.0.1',
                    port: 9000,
                    path: '/myapp'
                });
                break;
            }
            pr = new Peer({
                key: 'peerjs',
                secure: false,
                host: '192.168.0.105',
                port: 9000,
                path: '/myapp'
            });
            break;
        default:
            pr = new Peer();
            break;
    }
    pr.on('close', () => {
        peer.id = '';
    });
    pr.on('disconnected', () => {
        peer.id = '';
        peer.reconnect();
    });
    pr.on('call', (call) => {
        // Answer the call, providing our mediaStream
        db_msg('a', "rece call");
        call.answer(); //cam_stream_0
        db_msg('a', "answer");
        call.on('stream', function (stream) {
            //console.log('received remote stream');
            // const video = document.querySelector('video');
            if (!stream) {
                db_msg('a', "received stream0");
                return;
            }
            if (cam_stream_0)
                return;
            db_msg('a', "received stream01");
            rv0.srcObject = stream;
            cam_stream_0 = stream;
        });
        call.on('close', function () {
            console.log('received remote stream');
        });
    });
    /*
    pr.on('call', function (call) {
        // Answer the call, providing our mediaStream
        db_msg('a', "rece call");
        call.answer(cam_stream_0);//cam_stream_0
        db_msg('a', "answer");
        call.on('stream', function (stream) {
            //console.log('received remote stream');
           // const video = document.querySelector('video');
            if (!stream) {
                db_msg('a', "received stream0");
                return;
            }
            db_msg('a', "received stream01");
            rv0.srcObject = stream;
           // cam_stream_0 = stream;
        });
        call.on('close', function () {
            console.log('received remote stream');
        });
    });

    */
    pr.on('connection', function (conn) {
        con_map.set(conn.peer, conn);
        conn.on('data', (data) => {
            if (p_as_web(data, conn)) {
                return;
            }
            if (data.c == 'close') {
                con_map.delete(conn.peer);
                conn.close();
            }
            if (data.c == 'video') {
                if (data.c1 == 'b') {
                    /*
                    b1 = data.bx;

                   
                    const superBuffer = new Blob(b1, { type: 'video/webm' });
                    video.src = null;
                    video.srcObject = null;
                    video.src = window.URL.createObjectURL(superBuffer);
                    video.controls = true;
                    video.play();
                    */
                }
            }
        });
        conn.on('close', () => {
            //  msg = { "c": "main_id", "v": id };
        });
        conn.on('error', (err) => {
            // msg = { "c": "main_id", "v": id };
        });
    });
    pr.on('open', function (id) {
        peer_count++;
        console.log('My peer ID is: ' + id);
        t_my_id.innerText = id + ':' + peer_count.toString();
        //connect_server();
        pr.server_comm = connect_other(pr, server_id, 'to server');
        ws.send_obj({ "c": "main_id", "v": id });
    });
    return pr;
}
//# sourceMappingURL=peer_client.js.map