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
    </Row>
    <Row style="margin-top: 20px">
      <Col span="10">
        <Card>
          <p slot="title">
            <Icon type="ios-camera"/>
            摄像头
          </p>
          <div style="text-align:center; height: 600px">
            <!--图片展示-->
            <div>
              <div id="rectangle"></div>
              <canvas id="canvas" ref="canvas" width="450" height="350" style="position: absolute;left: 50px;top: 60px"></canvas>
              <video id="video" ref="video" width="450" height="350" autoplay style="position: absolute;left: 50px;top: 60px"></video>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="13" offset="1">
        <Card>
          <p slot="title">
            <Icon type="ios-camera"/>
            手势检测
          </p>
          <div style="text-align:center; height: 600px">
            <h3>{{msg}}</h3>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: "GestureAnalyse",
    data() {
      return {
        headImgSrc: '',
        cameraOpenStatus: false,
        cameraOpenLoading: false,
        imageBase64Data: '',
        isDetection: false,
        time: '',
        msg: ''
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
          this.time = setInterval(()=>{
            this.imageBase64Data = ''
            this.photograph()
          }, 3000)
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
        // 上传拍照信息  调用接口上传图片 .........
        this.imageBase64Data = str
        this.uploadData()
      },

      // 关闭摄像头
      closeCamera() {
        clearInterval(this.time)
        this.time = ''
        if (!this.$refs['video'].srcObject) return
        let stream = this.$refs['video'].srcObject
        let tracks = stream.getTracks()
        tracks.forEach(track => {
          track.stop()
        })
        this.$refs['video'].srcObject = null
        this.cameraOpenStatus = false
        //清空画布
        let ctx2 = this.$refs['canvas'].getContext('2d')
        ctx2.clearRect(0, 0, 450, 350);
        //清空数据
        this.imageBase64Data = ''
        //修改状态
        this.isDetection = false
      },
      //上传数据
      uploadData() {
        axios.post("/api/body/gesture",{'data': this.imageBase64Data}).then((response) => {
          let data = JSON.parse(response.data.data)
          console.log(data)
          let result = data.result
          for (let i = 0; i < result.length; i++) {
            if(result[i].classname == 'Six') {
                let audio = new Audio("http://127.0.0.1:8080/audio/test?content=警告警告。检测到呼救手势。&id=" + Math.random())
                audio.play()
                this.$Message.error("有危险!!!")
                this.msg = "检测到呼救手势"
            }
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      beforeDestroy() {
        this.closeCamera()
        this.isDetection = false
      }
    }
  }
</script>

<style scoped>

</style>
