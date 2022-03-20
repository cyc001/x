function init_peer() {
    if (peer)
        return;
    peer = new Peer();
    peer.server_id = '';
    peer.server_conn = null;
    peer.live_room_id = 0;
    peer.on('close', function () {
        peer.id = '';
    });
    peer.on('disconnected', function () {
        peer.id = '';
        peer.reconnect();
    });
    peer.on('call', function (call) {
        // Answer the call, providing our mediaStream
        db_msg('a', "rece call");
        call.answer(); //cam_stream_0
        db_msg('a', "answer");
        call.on('stream', function (stream) {
            //console.log('received remote stream');
            // const video = document.querySelector('video');
            db_msg('a', "received stream");
            rv0.srcObject = stream;
            cam_stream_0 = stream;
        });
        call.on('close', function () {
            console.log('received remote stream');
        });
    });
    peer.on('connection', function (conn) {
        conn.on('data', function (data) {
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
        conn.on('close', function () {
            //  msg = { "c": "main_id", "v": id };
        });
        conn.on('error', function (err) {
            // msg = { "c": "main_id", "v": id };
        });
    });
    peer.on('open', function (id) {
        var msg = { "c": "main_id", "v": id };
        console.log('My peer ID is: ' + id);
        //ws.send(JSON.stringify(msg));
        t_my_id.innerText = id;
    });
}
//# sourceMappingURL=peer_client.js.map