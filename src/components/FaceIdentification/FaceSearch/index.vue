<template>
  <Row>
    <Row>
      <!--....-->
    </Row>
    <Row style="margin-top: 10px">
      <Col span="8">
        <Card>
          <p slot="title">
            <Icon type="ios-cloud-circle"/>
            人脸库
          </p>
          <Scroll height="625">
            <Avatar v-for="(item, index) in $store.state.faceSearch.imageDB" :key="index" :src="item" shape="square"
                    style="width: 100px;height: 100px;margin: 10px"/>
          </Scroll>
        </Card>
      </Col>
      <Col span="16" style="padding-left: 10px">
        <Card>
          <p slot="title">
            <Icon type="ios-aperture"/>
            人脸检索
          </p>
          <Row>
            <Col span="9">
              <Divider>上传图片</Divider>
              <p style="margin-bottom: 10px">
                <Button type="primary" long @click="search" :disabled="uploadImg==''"
                        :loading="$store.state.faceSearch.searchStatus">搜索
                </Button>
              </p>
              <Upload ref="upload" :show-upload-list="false" :format="['jpg']" :max-size="4096" multiple type="drag"
                      :on-success="uploadImgSuccess" :on-format-error="uploadFormatError" :on-error="uploadFail"
                      action="/api/face/upload" style="display: inline-block;width:100%;">
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
            <Col span="14" offset="1">
              <Divider>相似图片</Divider>
              <Card>
                <Scroll height="535">
                  <p v-if="$store.state.faceSearch.imageSimilarity.length == 0" style="text-align: center">
                    暂无相似图片
                  </p>
                  <Avatar v-for="(item, index) in $store.state.faceSearch.imageSimilarity" :key="index" :src="item"
                          shape="square" style="width: 100px;height: 100px;margin: 20px"/>
                </Scroll>

              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </Row>
</template>

<script>
  export default {
    name: "FaceSearch",
    data() {
      return {
        uploadImg: ''
      }
    },
    mounted() {
      this.$store.dispatch("faceSearch/faceSearchSetImageDB")
    },
    methods: {
      uploadImgSuccess(response, file) {
        this.$Message.info("上传成功")
        this.uploadImg = response.data
        this.$store.dispatch("faceSearch/faceSearchSetImageDB")
      },
      uploadFormatError(file, fileList) {
        this.$Message.error("文件错误")
      },
      uploadFail(error, file) {
        this.$Message.error("上传失败")
      },
      search() {
        this.$store.dispatch("faceSearch/faceSearchSimilarity", this.uploadImg)
      }
    }
  }
</script>

<style scoped>

</style>
