<template>
  <div class="layout">
    <Layout>
      <Header>
        <home-nav-bar/>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <home-menu/>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <home-content/>
        </Layout>
      </Layout>
      <home-footer/>
    </Layout>
  </div>
</template>

<script>
  import HomeMenu from "./components/HomeMenu";
  import HomeNavBar from "./components/HomeNavBar";
  import HomeContent from "./components/HomeContent";
  import HomeFooter from "./components/HomeFooter";

  export default {
    name: "Home",
    components: {HomeFooter, HomeContent, HomeNavBar, HomeMenu},
    data() {
      return {
        emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
      }
    },
  }
</script>

<style scoped>

  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    min-height: 100%;
  }

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

  .layout-nav {
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }

  .layout-footer-center {
    text-align: center;
  }
</style>
