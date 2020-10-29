<!--
Template Name: backend
Create author: qinglong
Create Time  : 2020-10-15
-->
<template>
  <div class="app-body">
    <div class="app-header">header</div>
    <div class="app-side">
      <mixSide />
    </div>
    <div class="app-main">
      <mainContent />
    </div>
  </div>
</template>
<script>
export default {
  name: 'backend',
  components: { mainContent: () => import('@/views') },
  data() {
    return {};
  }
};
</script>
<style lang='less' scoped>
.app-body {
  position: relative;
  .app-header {
    position: sticky;
    top: 0;
  }
  .app-side {
    position: sticky;
    top: 40px;
    left: 0;
    height: 100vh;
    background: #ccc;
    width: 200px;
  }
}
</style>