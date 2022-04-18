class WS {
    constructor() {
        this.server = 'ws://127.0.0.1:8080'; // 'ws://localhost:8080';
        this.socket = null;
        this.socket = new WebSocket(this.server);
        db_msg('ws', "new");
        // Connection opened
        this.socket.addEventListener('open', function (event) {
            db_msg('ws', "open");
            if (peer.id)
                ws.send_obj({ "c": "main_id", "v": peer.id });
            else
                ws.send_obj({ "c": "ws_open", "v": '' });
            //    fetchAB('http://127.0.0.1/1.jpg', process_blob);
        });
        this.socket.addEventListener('error', function (event) {
            //      ws.socket.close();
            //  ws.socket = new WebSocket(ws.server);
            db_msg('ws', "error");
        });
        this.socket.addEventListener('close', function (event) {
            ws.socket = null;
            db_msg('ws', "close");
        });
        this.socket.addEventListener('message', function (event) {
            console.log('Message from server "' + event.data + '"');
            db_msg('ws', event.data); // JSON.parse(event.data);
            var m = JSON.parse(event.data);
            if ((m['c'] == 'req_web_page' || m['c'] == 'req_web_res') || (m['c'] == 'answer_web_res' || m['c'] == 'answer_web_page')) {
                if (!con_map.has(m.web_peer_id)) {
                    connect_other(peer, m.web_peer_id, 'to other');
                    ws_tasks.push(event.data);
                }
                else {
                    con_map.get(m.web_peer_id).send(event.data);
                }
                return;
            }
            if (m['c'] == 'filex') {
                //rv2.srcObject = m['stream'];
                var blob = new Blob(m['stream'], {
                    type: "image/jpeg"
                });
                document.getElementById("test_img").src = window.URL.createObjectURL(blob);
            }
            if (m['c'] == 'file') {
                rv2.srcObject = m['stream'];
            }
            if (m['c'] == 'server_id') {
                //  peerjs.server_id = msg['v']; 
                //  connect_server(msg['v']);
            }
            //ws.send('I receive :' + event.data);
        });
    }
    send(s) {
        if (this.socket != null) {
            if (this.socket.readyState == 1) {
                this.socket.send(s);
            }
        }
    }
    send_obj(s) {
        if (this.socket != null) {
            if (this.socket.readyState == 1) {
                this.socket.send(JSON.stringify(s));
            }
        }
    }
}
//# sourceMappingURL=ws_client.js.map