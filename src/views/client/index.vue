<!--
Template Name: client
Create author: qinglong
Create Time  : 2020-10-15
-->
<template>
  <div class="app-body">
    <div class="app-header">header</div>
    <div class="app-content">
      <div class="app-side">side</div>
      <div class="app-main">
        <mainContent />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'client',
  components: { mainContent: () => import('@/views') },
  data() {
    return {};
  }
};
</script>
<style lang='less' scoped>
</style>