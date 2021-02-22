<!--
 * @Description: 预览模式 props: tplStr [String 完整的html模版]
-->
<template>
  <div class="editor-preview">
    <div
      style="position: relative;"
      v-html="tplStr.PROP_HEADER_HTML"
    ></div>
    <div
      style="position: relative;"
      v-html="tplStr.PROP_PAGE_HTML"
    ></div>
    <div
      style="position: relative;"
      v-html="tplStr.PROP_FOOTER_HTML"
    ></div>
  </div>
</template>
<script>
import '@/common/styles/index.scss'
export default {
  name: 'Preview',
  componentName: 'Preview',
  props: {
    tplStr: {
      type: Object,
      default: () => { }
    }
  }
}
</script>
<style lang="scss">
.editor-preview {
  width: fit-content;
  height: 100%;
  margin: 0 auto;
  background: $white;
}
</style>