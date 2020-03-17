<template>
  <Card>
    <p slot="title">
      <Icon type="ios-aperture"/>
      人数统计
    </p>
    <Row>
      <Col span="9">
        <Divider>上传图片</Divider>
        <Upload ref="upload" :show-upload-list="false" :format="['jpg']" :max-size="4096" multiple type="drag"
                :on-success="uploadImgSuccess" :on-format-error="uploadFormatError" :on-error="uploadFail"
                action="/api/body/upload" style="display: inline-block;width:100%;">
          <div style="width: 100%;height:100px;line-height: 100px;">
            <Icon type="ios-camera" size="50"></Icon>
          </div>
        </Upload>
        <Card>
          <img :src="uploadImg" v-if="uploadImg != ''" width="100%">
          <p v-else style="text-align: center">
            暂未上传图片
          </p>
        </Card>
      </Col>
      <Col span="14" offset="1" style="text-align: center">
        <Divider>人群数量统计</Divider>
        <h1>总人数: {{personNum}}人</h1>
        <img :src="imageData" style="margin-top: 20px;width: 60%">
      </Col>
    </Row>
  </Card>
</template>

<script>
    export default {
        name: "PersonNumber",
        data() {
          return {
            uploadImg: '',
            imageData: '',
            personNum: 0
          }
        },
        methods: {
          uploadImgSuccess(response, file) {
            this.$Message.info("上传成功")
            this.uploadImg = response.data.oldImage
            let jsonData = JSON.parse(response.data.msg)
            this.imageData = 'data:image/jpg;base64,' + jsonData.image
            console.log(jsonData.image)
            this.personNum = jsonData.person_num
            if(this.personNum > 100) {
              let audio = new Audio("http://127.0.0.1:8080/audio/test?content=警告。人数过于密集！!&id=" + Math.random())
              audio.play()
            }
          },
          uploadFormatError(file, fileList) {
            this.$Message.error("文件错误")
          },
          uploadFail(error, file) {
            this.$Message.error("上传失败")
          }
        }
    }
</script>

<style scoped>

</style>



