<!--
 * @Description: 
 * @props: 
-->
<!-- 设计预览 -->
<template>
  <div class="components-preview">
    <div class="setting-bg"></div>
    <div class="preview-panel">
      <div class="iframe-wrapper"
           :style="{ width: pageData.width + 'px', height: pageData.height }">
        <EngineH5Swiper :pageData="pageData"
                        :pagetype="pagetype"></EngineH5Swiper>
      </div>
    </div>
    <span class="cloase-btn"
          @click="closePreview">
      <i class="el-icon-close"></i>
    </span>
  </div>
</template>

<script>
import EngineH5Swiper from './engine-h5-swiper/src/index'
export default {
  name: 'preview-page',
  components: {
    EngineH5Swiper
  },
  methods: {
    closePreview() {
      this.$emit('closePreview', false)
    }
  },
  props: {
    pageData: {
      type: Object,
      default: () => {}
    },
    pagetype: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.components-preview {
  .setting-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1042;
  }
  .preview-panel {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1050;
    overflow: hidden;
    height: 100%;
    overflow: auto;
    .iframe-wrapper {
      margin: 0 auto;
      background: white;
      margin-bottom: 10px;
    }
  }
  .cloase-btn {
    position: fixed;
    top: 8px;
    right: 20px;
    font-size: 28px;
    color: #7f8593;
    -webkit-transition: all 0.28s;
    transition: all 0.28s;
    z-index: 1060;
    cursor: pointer;
    &:hover {
      color: $primary;
    }
  }
}
</style>
