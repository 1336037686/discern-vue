<template>
  <Row>
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
    <Row style="margin-top: 10px">
      <Col span="8">
        <Card>
          <p slot="title">
            <Icon type="ios-camera"/>
            摄像头
          </p>
          <div style="text-align:center; height: 500px">
            <!--图片展示-->
            <div>
              <div id="rectangle"></div>
              <video id="video" ref="video" width="450" height="350" autoplay style="position: absolute;left: 50px;top: 60px"></video>
              <canvas id="canvas" ref="canvas" width="450" height="350" style="position: absolute;left: 50px;top: 60px"></canvas>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="8" style="padding-left: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"/>
            分析
          </p>
          <div style="text-align:center; height: 500px">
            <!--Canvas-->
            <canvas ref="canvas2" width="450px" height="350px"/>
          </div>
        </Card>
      </Col>
      <Col span="8" style="padding-left: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"/>
            基础信息
          </p>
          <List header="个人信息" border size="large">
            <ListItem>
              <span>用户ID:</span>
              <span v-if="$store.state.faceAuthe.user != ''">{{$store.state.faceAuthe.user.id }}</span>
              <span v-else>暂无用户ID</span>
            </ListItem>
            <ListItem>
              <span>用户名:</span>
              <span v-if="$store.state.faceAuthe.user != ''">{{$store.state.faceAuthe.user.name}}</span>
              <span v-else>暂无用户名</span>
            </ListItem>
            <ListItem>
              <span>密码:</span>
              <span v-if="$store.state.faceAuthe.user != ''">{{$store.state.faceAuthe.user.password}}</span>
              <span v-else>暂无密码</span>
            </ListItem>
            <ListItem>
              <Scroll height="250" style="width: 100%">
                <p v-if="$store.state.faceAuthe.user == ''">暂无图库</p>
                <Avatar v-for="(item, index) in $store.state.faceAuthe.user.userImg" :key="index" :src="item" shape="square" style="width: 100px;height: 100px;margin: 20px"/>
              </Scroll>
            </ListItem>
          </List>
        </Card>
      </Col>
    </Row>
  </Row>
</template>

<script>
  import 'tracking/build/tracking'
  import 'tracking/build/data/face-min'
  import 'tracking/build/data/eye-min.js'
  import 'tracking/build/data/mouth-min.js'

  export default {
    name: "FaceAuthe",
    data() {
      return {
        headImgSrc: '',
        cameraOpenStatus: false,
        cameraOpenLoading: false,
        imageBase64Data: '',
        isDetection: false
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

          //开启成功就检测头像
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
              context.strokeStyle = '#00ff00';
              context.lineWidth=3
              context.strokeRect(rect.x, rect.y, rect.width, rect.height)
              context.fillStyle = "#fff";
              context.fillText('Person', rect.x + rect.width + 5, rect.y + 11);
              context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 22);
              context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 33);
              //截图
              if(!this.isDetection){
                this.$Message.info("检测到人像")
                this.photograph()
              }
              this.isDetection = true
            })
          })
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
          this.cameraOpenLoading = false
        })
      },
      // 拍照
      photograph() {
        if(this.$store.state.faceAuthe.user != '') {
          this.$Message.info("搜索成功")
        }
        let ctx = this.$refs['canvas2'].getContext('2d')
        // 把当前视频帧内容渲染到canvas上
        ctx.drawImage(this.$refs['video'], 0, 0, 450, 350)
        // 转base64格式、图片格式转换、图片质量压缩
        let imgBase64 = this.$refs['canvas2'].toDataURL('image/jpeg', 0.7)
        // 由字节转换为KB 判断大小
        let str = imgBase64.replace('data:image/jpeg;base64,', '')
        let strLength = str.length
        let fileLength = parseInt(strLength - (strLength / 8) * 2)
        // 图片尺寸  用于判断
        let size = (fileLength / 1024).toFixed(2)
        this.imageBase64Data = str
        // 上传拍照信息  调用接口上传图片 .........
        this.uploadData()
      },

      // 关闭摄像头
      closeCamera() {
        clearInterval(this.timer);
        this.timer = ''
        if (!this.$refs['video'].srcObject) return
        let stream = this.$refs['video'].srcObject
        let tracks = stream.getTracks()
        tracks.forEach(track => {
          track.stop()
        })
        this.$refs['video'].srcObject = null
        this.cameraOpenStatus = false
        //清空画布
        let ctx = this.$refs['canvas2'].getContext('2d')
        ctx.clearRect(0, 0, 450, 350);
        let ctx2 = this.$refs['canvas'].getContext('2d')
        ctx2.clearRect(0, 0, 450, 350);
        //清空状态
        this.$store.dispatch('faceAuthe/resetData')
        //清空数据
        this.imageBase64Data = ''
        //修改状态
        this.isDetection = false
      },
      //上传数据
      uploadData() {
        this.$store.dispatch('faceAuthe/doFaceAuthe', this.imageBase64Data)
      },
      beforeDestroy() {
        this.closeCamera()
        this.$store.dispatch('faceAuthe/resetData')
        this.isDetection = false
      }
    }
  }
</script>
<style scoped>

</style>
