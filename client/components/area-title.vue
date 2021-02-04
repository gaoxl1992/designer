<!--
 * @Description: 属性设置标题区域
-->
<template>
  <div class="attr-header">
    <div>{{title}}</div>
    <div class="attr-header-desc">{{desc}}</div>
  </div>
</template>
<script>
export default {
  name: 'AreaTitle',
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
.attr-header {
  font-size: 14px;
  font-weight: 500;
  padding: 20px 10px 10px 10px;
  color: $font-color-base;
  line-height: 22px;
  position: relative;
  .attr-header-desc {
    font-weight: 400;
    color: #707070;
    line-height: 22px;
    padding-top: 4px;
  }
  &::after {
    height: 1px;
    width: 100%;
    background-color: $line-color;
    content: ' ';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>