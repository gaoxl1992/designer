<!--
 * @Author: gaoxl
 * @Date: 2021-01-07 15:21:38
 * @LastEditTime: 2021-01-15 13:51:47
 * @LastEditors: Please set LastEditors
 * @Description: 预览模式 props: tplStr [String 完整的html模版]
-->
<template>
  <div class="editor-preview">
    <div v-html="tplStr"></div>
  </div>
</template>
<script>
export default {
  name: 'Preview',
  props: {
    tplStr: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss">
.editor-preview {
  overflow: auto !important;
  width: fit-content;
  height: 100%;
  margin: 0 auto;
  background: #fff;
}
</style>