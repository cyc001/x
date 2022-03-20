var play_id = 0;
var usr_obj_buf = [];
function play_2s() {
    play_id = 0;
    var mimeType = codecPreferences.options[codecPreferences.selectedIndex].value.split(';', 1)[0];
    if (usr_obj_buf.length == 0) {
        for (var i = 0; i < rec_arr.length; i++) {
            usr_obj_buf.push(window.URL.createObjectURL(rec_arr[i]));
        }
    }
    errorMsgElement.innerText = "0";
    v0.src = null;
    v0.srcObject = null;
    v0.src = usr_obj_buf[0];
    v0.style.visibility = "visible";
    v1.src = null;
    v1.srcObject = null;
    v1.src = usr_obj_buf[1];
    v1.style.visibility = "";
    v0.onended = function (event) {
        play_id++;
        if (play_id < rec_arr.length) {
            v1.style.visibility = "visible";
            v1.play();
        }
        v0.style.visibility = "";
        if (play_id < rec_arr.length - 1) {
            v0.src = usr_obj_buf[play_id + 1];
        }
        errorMsgElement.innerText = play_id.toString();
    };
    v1.onended = function (event) {
        play_id++;
        if (play_id < rec_arr.length) {
            v0.style.visibility = "visible";
            v0.play();
        }
        v1.style.visibility = "";
        if (play_id < rec_arr.length - 1) {
            v1.src = usr_obj_buf[play_id + 1];
        }
        errorMsgElement.innerText = play_id.toString();
    };
    v0.play();
}
//# sourceMappingURL=play_blob.js.map