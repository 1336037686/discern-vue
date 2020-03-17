<template>
  <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-cash"/>
        人脸识别功能
      </template>
      <router-link to="/face/faceDetection" style="color: #515A6E"><MenuItem name="1-1">人脸检测</MenuItem></router-link>
      <router-link to="/face/faceSearch" style="color: #515A6E"><MenuItem name="1-2">人脸搜索</MenuItem></router-link>
      <router-link to="/face/faceAuthe" style="color: #515A6E"><MenuItem name="1-3">身份验证</MenuItem></router-link>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-body"/>
        人体分析功能
      </template>
      <MenuItem name="2-1">违规行为检测</MenuItem>
      <router-link to="/body/personNum" style="color: #515A6E"><MenuItem name="2-2">人流量统计</MenuItem></router-link>
      <MenuItem name="2-3">意外检测</MenuItem>
      <router-link to="/body" style="color: #515A6E"><MenuItem name="2-4">手势识别</MenuItem></router-link>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="ios-mic"/>
        语音识别功能
      </template>
      <router-link to="/audio/callhelp" style="color: #515A6E"><MenuItem name="3-1">语音呼救</MenuItem></router-link>
      <MenuItem name="3-2">语音操作</MenuItem>
      <MenuItem name="3-3">语音提醒</MenuItem>
      <MenuItem name="3-4">智能客服</MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="md-flower"/>
        其他功能
      </template>
      <MenuItem name="4-1" disabled>暂未开发</MenuItem>
    </Submenu>
  </Menu>
</template>

<script>
  export default {
    name: "HomeMenu"
  }
</script>

<style scoped>

</style>
