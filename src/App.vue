<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    // mounted() {
    //   let audio = new Audio("http://127.0.0.1:8080/audio/test?content=我是智能客服小A，请问有什么需要帮忙的吗&id=" + Math.random())
    //   audio.play()
    // }
  }
</script>

<style>
  #app {

  }
</style>
