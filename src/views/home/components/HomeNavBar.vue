<template>
  <Menu mode="horizontal" theme="dark" active-name="1">
    <div class="layout-logo">
      <router-link to="/default" style="color: white"><Icon type="md-flash" />识别</router-link>
    </div>
    <div class="layout-nav">
      <MenuItem name="1" style="float: right">
        <Icon type="md-person" />
        admin
      </MenuItem>
    </div>
  </Menu>
</template>

<script>
    export default {
        name: "HomeNavBar"
    }
</script>

<style scoped>
  .layout-logo {
    width: 100px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    left: 20px;
    color: white;
    text-align: center;
    font-size: 25px;
  }

</style>
