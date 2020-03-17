<template>
  <div>
    <Card style="margin-top: 10px">
      <p style="font-size: 20px">识别到内容: {{msg}}</p>
      <h2 style="color: red;text-align: center">{{content}}</h2>
    </Card>
  </div>
</template>

<script>
  import Recorder from 'js-audio-recorder';
  import axios from "axios";

  export default {
    name: "index",
    data() {
      return {
        recorder : new Recorder({
          sampleBits: 16,         // 采样位数，支持 8 或 16，默认是16
          sampleRate: 16000,      // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
          numChannels: 1,         // 声道，支持 1 或 2， 默认是1
          compiling: true,       // 是否边录边转换，默认是false
        }),
        playTimer: '',
        ws: '',
        msg: '',
        content: '',
      }
    },
    mounted() {
      this.start()
    },
    destroyed() {
      this.stop()
    },
    methods: {
      start() {
        // TODO: 音频录制BUG
        //初始化websocket
        this.ws = new WebSocket("ws://localhost:8080/imserver/10")
        this.ws.onmessage = this.getMessage
        this.recorder.start();
        // 定时获取录音的数据并播放
        this.playTimer = setInterval(() => {
          if (!this.recorder) {
            return;
          }

          let newData = this.recorder.getNextData();
          if (!newData.length) {
            return;
          }
          let byteLength = newData[0].byteLength
          let buffer = new ArrayBuffer(newData.length * byteLength)
          let dataView = new DataView(buffer)

          // 数据合并
          for (let i = 0, iLen = newData.length; i < iLen; ++i) {
            for (let j = 0, jLen = newData[i].byteLength; j < jLen; ++j) {
              dataView.setInt8(i * byteLength + j, newData[i].getInt8(j))
            }
          }
          // 将录音数据转成WAV格式，并播放
          let a = Recorder.encodeWAV(dataView, 16000, 16000, 1, 16)
          let wavBlob = new Blob([a], { type: 'audio/wav' });
          // let formdata = new FormData();
          // formdata.append('file', wavBlob)
          this.ws.send(wavBlob)
        }, 5000)
      },
      stop() {
        // 结束录音
        this.recorder.stop();
        this.ws.close()
      },
      sendMessage(content) {
        this.ws.send(content)
      },
      getMessage(msg) {
        console.log(msg.data)
        if (msg.data != this.msg) {
          this.msg = msg.data
          // let audio = new Audio("http://127.0.0.1:8080/audio/test?content=" + msg.data + "&id=" + Math.random())
          // audio.play()
          if(msg.data.indexOf("救命") != -1 || msg.data.indexOf("救人") != -1) {
            let audio = new Audio("http://127.0.0.1:8080/audio/test?content=警告警告。有人呼救!&id=" + Math.random())
            audio.play()
            this.content = "警告，有人呼救!"
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
