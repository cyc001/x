import Shake from './shake';
import data from './data';

class ShakeGame {

    constructor(options) {
        this.shakeTop = this.$('.shake-top');
        this.shakeBottom = this.$('.shake-bottom');
        this.shakeCard = this.$('.music-player');
        this.shakeInfo = this.$('.shake-info');
        this.musicPlay = this.$('.music-player-btn');
        this.musicName = this.$('.music-player-name');
        this.musicAuthor = this.$('.music-player-author');
        this.music = null; // 当前播放的音乐
        this.playing = false; // 音乐是否正在播放
        this.hasLoad = false; // 是否有加载部分音乐数据
        this.shake = new Shake({
            threshold: 10
        });

        this.audio = this.$('.audio');
        document.addEventListener('WeixinJSBridgeReady', () => {
            this.audio.muted = true;
            this.audio.play();
            setTimeout(() => {
                this.audio.muted = false;
            }, 2000);
        }, false);
        this.shake.start();
        this.data = data;
        this.events();
    }

    $(arg) {
        return document.querySelector(arg);
    }

    // 随机一首歌
    randomMusic() {
        let len = this.data.length;
        let rd = Math.floor(Math.random() * len);
        return this.data[rd];
    }

    // 创建音乐播放器
    createMusicPlayer() {
        let _music = this.randomMusic();

        this.hasLoad = false;
        this.shakeCard.style.opacity = 1;
        this.musicName.innerHTML = _music.name;
        this.musicAuthor.innerHTML = _music.author;

        this.music = document.createElement('audio');
        this.music.src = _music.url;
    }

    // 开始摇一摇动画
    openBg() {
        if(this.music) {
            // 正在播放音乐则停止
            this.stopMusic();
        }
        this.audio.play();
        this.shakeTop.classList.add('translate');
        this.shakeBottom.classList.add('translate');
    }

    // 结束摇一摇动画
    closeBg() {
        this.shakeTop.classList.remove('translate');
        this.shakeBottom.classList.remove('translate');
    }

    // 显示详情
    showInfo() {
        history.pushState({}, 'info', window.location.href + '#info');
        this.shake.stop();
        this.shakeInfo.classList.add('show');
    }

    // 隐藏详情
    hideInfo() {
        this.shake.start();
        this.shakeInfo.classList.remove('show');
    }

    // 播放音乐
    playMusic() {
        this.playing = true;
        this.musicPlay.classList.add('loading');
        this.music.play();

        // 监听是否暂停之后再次开始播放
        this.music.addEventListener('playing', (e) => {
            if(!this.hasLoad) {
                return;
            }
            this.musicPlay.classList.remove('loading');
            this.musicPlay.classList.add('playing');
        }, false);

        // 监听是否可以开始播放
        this.music.addEventListener('canplay', (e) => {
            setTimeout(() => {
                this.hasLoad = true;
                this.musicPlay.classList.remove('loading');
                this.musicPlay.classList.add('playing');
            }, 2000);
        }, false);
    }

    // 停止音乐
    stopMusic() {
        this.musicPlay.classList.remove('playing');
        this.musicPlay.classList.remove('loading');
        this.playing = false;
        this.music.pause();
    }

    events() {

        // 监听摇一摇
        this.shake.on('shake', () => {
            this.openBg();
            setTimeout(() => {
                this.closeBg();
                this.createMusicPlayer();
            }, 1000);
        });

        // 查看详情
        this.shakeCard.addEventListener('touchstart', () => {
            this.showInfo();
        }, false);

        // 点击播放音乐
        this.musicPlay.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            if(this.music) {
                if(this.playing) {
                    this.stopMusic();
                }else {
                    this.playMusic();
                }
            }
        }, false);

        // 监听返回
        window.addEventListener('popstate', () => {
            if (window.location.hash !== 'info') {
                this.hideInfo();
            }
        }, false);
    }

}

let shakeGame = new ShakeGame({});
