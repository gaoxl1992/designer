<template>
  <div class="engine-template-wrapper">
    <div
      class="swiper-container"
      :class="'swiper-container-' + pagetype"
      :style="outerPadding"
    >
      <div
        class="swiper-slide flat relative"
        style="padding: 10px"
        :style="
          getCommonStyle({ 
            ...pageData.commonStyle,
            width: pageData.width,
            height: pageData.height,
            paddingTop: nopt ? 0 : 10,
            paddingBottom: nopb ? 0 : 10,
          })
        "
      >
        <!--页面内容区域-->
        <div
          class="rad-page-wrapper"
          :style="
            getCommonStyle(
              {
                ...pageData.commonStyle,
                top: 0,
                position: 'relative',
              },
              scalingRatio
            )
          "
        >
          <componentsTemplate
            v-for="(item, index) in pageData.elements"
            :ref="'preview' + index"
            :key="index"
            :loaded="item._loaded"
            :element="item"
            :editorId="index"
            :pagetype="pagetype"
            @focusEditor="focusEditor"
            :focusEditorId="focusEditorId"
            :style="
              getCommonStyle(
                {
                  ...item.commonStyle,
                  scalingRatio,
                  fontSize: item.elName === 'rad-table' ? 'auto' : item.commonStyle.fontSize
                })"
          >
          </componentsTemplate>
        </div>
        <div
          class="page-wrapper-mask"
          v-if="pagetype!=='preview'"
        >
          <div
            class="page-de"
            :class="{ 'page-line': item !== 1 }"
            v-for="item in +pageData.totalPages"
            :key="item"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editorProjectConfig from '@/config/DataModel'
import componentsTemplate from './components-template'
export default {
  name: 'EngineH5Swiper',
  components: {
    componentsTemplate
  },
  props: {
    pageData: {
      type: Object,
      default: () => { }
    },
    pagetype: {
      type: String,
      default: ''
    },
    nopt: {
      type: Boolean,
      default: false
    },
    nopb: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      getCommonStyle: editorProjectConfig.getCommonStyle,
      scalingRatio: 1,
      showTableModel: false,
      outerPadding: {},
      focusEditorId: ''
    }
  },
  created () {
    // 预览页外边距
    if (this.pagetype === 'preview') {
      console.log(this.pageData.outerPadding)
      const outerPd = this.pageData.outerPadding + 'px'
      this.outerPadding = {
        paddingTop: this.nopt ? 0 : outerPd,
        paddingBottom: this.nopb ? 0 : outerPd,
        paddingLeft: outerPd,
        paddingRight: outerPd
      }
    }
    // 将组件加个状态标识
    if (this?.pageData?.elements?.length) {
      this.pageData.elements.forEach((e) => {
        e._loaded = true
      })
    }
  },
  methods: {
    focusEditor (e) {
      this.focusEditorId = e
    }
  },
}
</script>

<style lang="scss">
.engine-template-wrapper {
  .el-dialog__header {
    background: #d8dbe1;
    font-weight: 500;
    color: #333333;
    font-size: 16px;
    .el-icon-close {
      font-size: 14px;
    }
  }
  .engine-template-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .relative {
    position: relative;
  }
  .swiper-slide {
    overflow: hidden;
  }
  .page-wrapper-mask {
    height: 100%;
    width: 100%;
    z-index: 1000;
    position: absolute;
    left: -20px;
    top: -20px;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    .page-de {
      flex: 1;
    }
    .page-line {
      flex: 1;
      border-top: 1px dashed $primary;
    }
  }
}
</style>
