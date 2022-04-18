/*
 * 摇一摇组件
 * author: luoxue-xu.github.io
 * date: 201703014
 */

export default class Shake {

    constructor(options) {
        if(!'ondevicemotion' in window) {
            alert('您的浏览器不支持摇一摇功能，买iphone7送摇一摇功能');
            return;
        }
        this.timer = options.timer || 2000; // 每次摇一摇的间隔时间
        this.threshold = options.threshold || 10; // 多大摇动幅度可以触发摇一摇 数值越大，表示摇动的幅度要越大.
        this.lastTime = new Date(); // 上一次摇一摇的时间
        this.lastX = null; // X轴
        this.lastY = null; // Y轴
        this.lastZ = null; // Z轴
        this.shakeEnd = function() {}; // 摇一摇成功之后的回调
    }

    // 刷新数据
    refresh() {
        this.lastTime = new Date();
        this.lastX = null;
        this.lastY = null;
        this.lastZ = null;
    }

    handleEvent(event) {
        if(event.type === 'devicemotion') {
            return this.devicemotion(event);
        }
    }

    // 开始监听摇一摇
    start() {
        this.refresh();
        window.addEventListener('devicemotion', this, false);
    }

    // 结束监听摇一摇
    stop() {
        this.refresh();
        window.removeEventListener('devicemotion', this, false);
    }

    // 暂时eventType 只支持shake
    on(eventType, callback) {
        if(typeof callback === 'function' && eventType === 'shake') {
            this.shakeEnd = callback;
        }
    }

    // 摇一摇事件处理
    devicemotion(event) {
        let deviceInfo = event.accelerationIncludingGravity;
        let _x = 0;
        let _y = 0;
        let _z = 0;

        if(this.lastX === null && this.lastY === null && this.lastZ === null) {
            this.lastX = deviceInfo.x;
            this.lastY = deviceInfo.y;
            this.lastZ = deviceInfo.z;
        }

        // 计算幅度
        _x = Math.abs(this.lastX - deviceInfo.x);
        _y = Math.abs(this.lastY - deviceInfo.y);
        _z = Math.abs(this.lastZ - deviceInfo.z);

        if((_x >= this.threshold && _y >= this.threshold) || (_y >= this.threshold && _z >= this.threshold) || (_x >= this.threshold && _z >= this.threshold)) {
            let differenceTime = +new Date() - this.lastTime.getTime();
            if(differenceTime > this.timer) {
                this.shakeEnd(_x, _y, _z);
                this.lastTime = new Date();
            }
        }

        this.lastX = deviceInfo.x;
        this.lastY = deviceInfo.y;
        this.lastZ = deviceInfo.z;

    }
}
