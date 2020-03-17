<template>
  <div>
    <Row>
      <!--开启摄像头-->
      <Button type="primary" style="margin-left: 10px" :loading="cameraOpenLoading" @click="callCamera">
        <Icon type="ios-arrow-dropright-circle"/>
        开始检测
      </Button>
      <Button @click="closeCamera" :disabled="!cameraOpenStatus" type="error" style="margin-left: 10px">
        <Icon type="ios-close-circle"/>
        关闭检测
      </Button>
      <Button @click="openCamera">人脸检测</Button>
    </Row>
    <div style="margin-top: 20px;border: 2px;margin-left: 400px">
      <div class="demo-container">
        <div id="rectangle"></div>
        <video id="video" ref="video" width="800" height="530" autoplay></video>
        <canvas id="canvas" ref="canvas" width="800" height="530" style="border: 1px"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
  import 'tracking/build/tracking'
  import 'tracking/build/data/face-min'
  import 'tracking/build/data/eye-min.js'
  import 'tracking/build/data/mouth-min.js'

  export default {
    name: 'componentName',
    data() {
      return {
        headImgSrc: '',
        cameraOpenStatus: false,
        cameraOpenLoading: false,
        imageBase64Data: '',
        timer: '',
      }
    },
    methods: {
      openCamera() {
        let context = this.$refs['canvas'].getContext('2d')
        let tracker = new tracking.ObjectTracker('face');
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);
        tracking.track('#video', tracker, { camera: true })
        tracker.on('track', (event) => {
          context.clearRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);
          event.data.forEach((rect) => {
            console.log("x:" + rect.x + ",y:" + rect.y + ",w:" + rect.width + ",h:" + rect.height)
            context.strokeStyle = '#a64ceb';
            context.lineWidth=5
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            context.fillText('Person', rect.x + rect.width + 5, rect.y + 11);
            context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 22);
            context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 33);
          })
        })
      },
      // 调用摄像头
      callCamera() {
        this.cameraOpenLoading = true
        // H5调用电脑摄像头API
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
          this.cameraOpenStatus = true
          this.cameraOpenLoading = false
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
          this.cameraOpenLoading = false
        })
      },

      // 关闭摄像头
      closeCamera() {
        if (!this.$refs['video'].srcObject) return
        let stream = this.$refs['video'].srcObject
        let tracks = stream.getTracks()
        tracks.forEach(track => {
          track.stop()
        })
        this.$refs['video'].srcObject = null
        this.cameraOpenStatus = false
      }
    }
  }
</script>

<style scoped>
  video, canvas {
    position: absolute;
  }
</style>



