<!--
Template Name: login
Create author: qinglong
Create Time  : 2020-10-15
-->
<template>
<div>login</div>
</template>
<script>
export default {
name:"login",
 data() {
    return {};
  },
  created(){
    this.axios('/adminapi/sadf')
  }
};
</script>
<style lang='less' scoped>
</style>