<template>
  <div class="login">
    <Row>
      123
      <Switch v-model="ai_status" @on-change="change" />
    </Row>
    <Row style="margin-top: 10%">
      <Col span="6" offset="17">
        <Card>
          <p slot="title" style="text-align: center">
            用户登录
          </p>
          <Tabs>
            <TabPane label="账号" icon="md-person">
              <Form ref="formCustom" style="margin-left: 10px;margin-top: 30px">
                <FormItem prop="用户名" style="margin-top: 40px">
                  <Input type="text" size="large" placeholder="用户名" v-model="form.name"></Input>
                </FormItem>
                <FormItem prop="密码" style="margin-top: 40px">
                  <Input type="password" password  size="large" placeholder="密码" v-model="form.pwd"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" long style="height: 50px" @click="submitForm">登陆</Button>
                  <p style="text-align: right">
                    <a href="">忘记密码</a>
                    <a href="">免费注册</a>
                  </p>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane label="刷脸" icon="ios-cash">
              <Row style="text-align: center">
                <!--开启摄像头-->
                <Button type="primary" size="small" :loading="cameraOpenLoading" @click="callCamera">
                  <Icon type="ios-arrow-dropright-circle"/>
                  开始检测
                </Button>
                <Button @click="closeCamera" :disabled="!cameraOpenStatus" size="small" type="error" style="margin-left: 10px">
                  <Icon type="ios-close-circle"/>
                  关闭检测
                </Button>
              </Row>
              <div style="margin-top: 10px;">
                <div>
                  <video id="video" ref="video" width="450px" height="350px" autoplay></video>
                  <canvas id="canvas" ref="canvas" width="450px" height="350px"></canvas>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
  import 'tracking/build/tracking'
  import 'tracking/build/data/face-min'
  import 'tracking/build/data/eye-min.js'
  import 'tracking/build/data/mouth-min.js'

  export default {
    name: "Login",
    data() {
      return {
        headImgSrc: '',
        cameraOpenStatus: false,
        cameraOpenLoading: false,
        imageBase64Data: '',
        ai_status: true,
        form: {
          name: "",
          pwd: ""
        }
      }
    },
    methods: {
      submitForm() {
        if (this.form.name == "admin" && this.form.pwd == "admin") {
          this.$router.push("/")
        } else {
          this.$Message.error("登录失败，请检查您的输入是否有误")
        }
      },
      change() {
        console.log("ai is clock...")
      },
      // 语音播放
      aplayAudio () {
        let audio = new Audio("http://127.0.0.1:8080/audio/test?content=我是智能客服小A，请问有什么需要帮忙的吗&id=" + Math.random())
        audio.play()
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

          //开启成功就检测头像
          let context = this.$refs['canvas'].getContext('2d')
          let tracker = new tracking.ObjectTracker('face');

          tracker.setInitialScale(4);
          tracker.setStepSize(2);
          tracker.setEdgesDensity(0.1);
          tracking.track('#video', tracker, { camera: true })
          tracker.on('track', (event) => {
            context.clearRect(0, 0, this.$refs['canvas'].width, this.$refs['canvas'].height);

            //绘制选虚拟头像框
            context.strokeStyle = '#ccc';
            context.lineWidth=5
            context.setLineDash([10])
            context.beginPath();
            context.arc(225,125,110,0,2*Math.PI);
            context.stroke();

            event.data.forEach((rect) => {
              console.log("x:" + rect.x + ",y:" + rect.y + ",w:" + rect.width + ",h:" + rect.height)
              context.strokeStyle = '#00ff00';
              context.lineWidth=4
              context.setLineDash([0])
              context.strokeRect(rect.x, rect.y, rect.width, rect.height)
              context.fillStyle = "#fff";
              context.fillText('Person', rect.x + rect.width + 5, rect.y + 11);
              context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 22);
              context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 33);
              //截图
              if(!this.isDetection){
                this.$Message.info("检测到人像")
                this.closeCamera()
                this.$router.push("/")
              }
              this.isDetection = true
            })
          })
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
        //清空画布
        let ctx2 = this.$refs['canvas'].getContext('2d')
        ctx2.clearRect(0, 0, 450, 350);
        //清空数据
        this.imageBase64Data = ''
        //修改状态
        this.isDetection = false
      }
    },
    mounted() {
      this.aplayAudio()
    }
  }
</script>

<style scoped>
  .login {
    background:url('../../../assets/login_image/login.jpg')no-repeat;
    width:100%;
    height:100%;
    background-size:100% 100%;
    position:absolute;
  }

  video, canvas {
    position: absolute;
    padding: 10px;
  }
</style>
