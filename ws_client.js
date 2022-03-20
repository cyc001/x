var WS = /** @class */ (function () {
    function WS() {
        this.server = 'ws://127.0.0.1:8090'; // 'ws://localhost:8080';
        this.socket = null;
        this.socket = new WebSocket(this.server);
        db_msg('ws', "new");
        // Connection opened
        this.socket.addEventListener('open', function (event) {
            var msg = { "c": "ws_open", "v": '' };
            ws.send(JSON.stringify(msg));
            db_msg('ws', "open");
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
            var msg = JSON.parse(event.data);
            if (msg['c'] == 'server_id') {
                //  peerjs.server_id = msg['v']; 
                //  connect_server(msg['v']);
            }
            //ws.send('I receive :' + event.data);
        });
    }
    WS.prototype.send = function (s) {
        if (this.socket != null)
            this.socket.send(s);
    };
    return WS;
}());
//# sourceMappingURL=ws_client.js.map