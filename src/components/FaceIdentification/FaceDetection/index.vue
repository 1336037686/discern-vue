<template>
  <Card>
    <Row>
      <!--开启摄像头-->
      <Button type="primary" style="margin-left: 10px" :loading="cameraOpenLoading" @click="callCamera"><Icon type="ios-arrow-dropright-circle" /> 录 像</Button>
      <Button type="primary" style="margin-left: 10px" :disabled="!cameraOpenStatus" @click="photograph"><Icon type="ios-cut" /> 截 图</Button>
      <Button @click="closeCamera" type="error" style="margin-left: 10px"><Icon type="ios-close-circle" />关闭录像</Button>
      <Button @click="uploadData" type="primary" style="margin-left: 10px" :disabled="imageBase64Data == ''" :loading="$store.state.faceDetection.faceDetectionResetDataStatus"><Icon type="ios-cloud-circle"  />人脸检测</Button>
    </Row>
    <Row style="margin-top: 20px">
      <Col span="8" style="padding: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-camera" />
            摄像头
          </p>
          <div style="text-align:center; height: 500px" >
            <!--图片展示-->
            <video ref="video" width="450px" height="350px" autoplay/>
          </div>
        </Card>
      </Col>
      <Col span="8" style="padding: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-photos" />
            截图
          </p>
          <div style="text-align:center; height: 500px">
            <!--canvas截取流-->
            <canvas ref="canvas" width="450" height="350px" />
          </div>
        </Card>
      </Col>
      <Col span="8" style="padding: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-analytics" />
            上传分析
          </p>
          <div style="text-align:center; height: 500px">
            <div v-if="$store.state.faceDetection.faceDetectionAnalyseData != ''">
              <img :src="$store.state.faceDetection.faceDetectionAnalyseData" width="450" height="350px">
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </Card>
</template>

<script>
  export default {
    name: 'FaceDetection',
    data() {
      return {
        headImgSrc: '',
        cameraOpenStatus: false,
        cameraOpenLoading: false,
        imageBase64Data: ''
      }
    },
    methods: {
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
      // 拍照
      photograph() {
        let ctx = this.$refs['canvas'].getContext('2d')
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs['video'], 0, 0, 450, 350)
        // 转base64格式、图片格式转换、图片质量压缩
        let imgBase64 = this.$refs['canvas'].toDataURL('image/jpeg', 0.7)
        // 由字节转换为KB 判断大小
        let str = imgBase64.replace('data:image/jpeg;base64,', '')
        let strLength = str.length
        let fileLength = parseInt(strLength - (strLength / 8) * 2)
        // 图片尺寸  用于判断
        let size = (fileLength / 1024).toFixed(2)
        console.log(size)
        console.log(strLength)
        this.imageBase64Data = str
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
        //清空画布
        let ctx = this.$refs['canvas'].getContext('2d')
        ctx.clearRect(0, 0, 450, 350);
        //清空状态
        this.$store.dispatch('faceDetection/faceDetectionResetData')
        //清空数据
        this.imageBase64Data = ''
      },
      //上传数据
      uploadData() {
        this.$store.dispatch('faceDetection/faceDetectionAnalyseSetStatus', true)
        this.$store.dispatch('faceDetection/faceDetectionAnalyseImg', this.imageBase64Data)
      },
      beforeDestroy() {
        //清空画布
        let ctx = this.$refs['canvas'].getContext('2d')
        ctx.clearRect(0, 0, 450, 350);
        //清空状态
        this.$store.dispatch('faceDetection/faceDetectionResetData')
        //清空数据
        this.imageBase64Data = ''
        this.closeCamera()
      }
    }
  }
</script>
<style>

</style>
