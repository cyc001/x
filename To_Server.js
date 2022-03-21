var server_id = "13e00d26-2e4b-491d-8716-c8f68ccab6f1";
function connect_server() {
    if (server_id == "") {
        db_msg('server_id', 'empty');
        return;
    }
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
        var msg = { "c": "login", "c1": "in", "v": peer.id };
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
function p_server_msg(s) {
    var m = JSON.parse(s);
    if (m['c'] == 'send_video') {
        db_msg('rec', "send_video");
        var call_1 = peer.call(m['c1'], cam_stream_0);
        call_1.on('stream', function (remoteStream) {
            // Show stream in some <video> element.
            db_msg('org', "received stream0");
        });
        return;
    }
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