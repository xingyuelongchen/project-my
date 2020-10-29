<!--
Template Name: common
Create author: qinglong
Create Time  : 2020-10-15
-->
<template>
  <router-view v-slot="{component}">
    <transition mode="out-in" name="fade">
      <keep-alive :max="10" v-if="$route.meta.keepAlive">
        <component :is="component" />
      </keep-alive>
      <component v-else :is="component" />
    </transition>
  </router-view>
</template>
<script>
export default {
  name: 'common'
};
</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>