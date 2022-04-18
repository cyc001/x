class Greeter {
    constructor(element) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement("span");
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toUTCString(), 500);
    }
    stop() {
        clearTimeout(this.timerToken);
    }
}
window.onload = () => {
    //  fetchAB('http://localhost/1.jpg', process_blob);
    //  fetchAB('FILE://1.jpg', process_blob);
    // fetchAB('FILE://1.jpg', process_blob);
    // fetchAB('FILE:///E:/1/1.jpg', process_blob);
    //  fetchAB('http://127.0.0.1/1.jpg', process_blob);
    // const el = document.getElementById("content");
    // const greeter = new Greeter(el);
    // greeter.start();
    var isSupportDownload = 'download' in document.createElement('a');
    if (isSupportDownload) {
    }
    init_vars();
    db_msg('a', "begin");
    peer = init_peer(0);
    /*
    let test_peer = [];
    for (var i = 0; i < 999; i++) {
        let p_id = 'B' + i.toString() + 'A';
        test_peer.push(init_peer(1));

        for (var j = 0; j < 9000; j++) {
            j++;
            j++;
            p_id = 'A'
        }
    }*/
    ws = new WS();
    // var bb: HTMLButtonElement = document.querySelector('button#start');
    // bb.addEventListener('click', () => cam_init());
    //
};
window.onunload = () => {
    var msg = { 'c': 'close' };
    con_map.forEach((item, key, mapobj) => {
        item.send(JSON.stringify(msg));
    });
    if (ws) {
        ws.socket.close();
    }
    /*
    if (peer.server_conn) {
        //    peerjs.server_conn.send(JSON.stringify(msg));
        var msg = {'c':'close'};
        peer.server_conn.send(JSON.stringify(msg));
        //peer.server_conn.close();
    }*/
};
//# sourceMappingURL=app.js.map