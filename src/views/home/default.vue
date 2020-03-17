<template>
  <img :src="emptyGif" class="emptyGif">
</template>

<script>
  export default {
    name: "Default",
    data() {
      return {
        emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
      }
    }
  }
</script>

<style scoped>
  .emptyGif {
    display: block;
    margin: 0 auto;
  }
</style>
