<!-- 设计器主容器 -->
<template>
  <div class="designer-wrapper">
    <!--组件区域-->
    <div class="editor-page-edit-wrapper">
      <componentLibs :customComps="customComps" />
    </div>
    <!--页面编辑区域-->
    <div class="editor-main">
      <div class="control-bar-wrapper">
        <ControlBar :scale.sync="canvasConfig.scale"
                    @showPreview="showPreview = true" />
      </div>
      <editorPan :scale.sync="canvasConfig.scale" />
    </div>
    <!--属性编辑区域-->
    <div class="el-attr-edit-wrapper scrollbar-wrapper">
      <!-- 点选单个控件 -->
      <template v-if="activeElementUUID">
        <attrEdit></attrEdit>
      </template>
      <!-- 框选多个控件 -->
      <template v-else-if="activeElementsUUID && activeElementsUUID[0]">
        <commonAttrEdit :uuids="activeElementsUUID"></commonAttrEdit>
      </template>
      <!-- 编辑纸张属性 -->
      <pageAttrEdit v-else></pageAttrEdit>
    </div>
    <!--预览-->
    <previewWrapper v-if="showPreview"
                    @closePreview="showPreview = false"
                    :pageData="pageData">
    </previewWrapper>
  </div>
</template>

<script>
import ComponentLibs from './component-libs/Index'
import EditorPan from './editor-panel'
import AttrEdit from './attr-configure/attr-edit'
import PageAttrEdit from './attr-configure/page-attr-edit'
import CommonAttrEdit from './attr-configure/common-attr-edit'
import ControlBar from '@client/components/control-bar'
import { mapState } from 'vuex'
import PreviewWrapper from '@client/components/preview-wrapper'

export default {
  name: 'Designer',
  components: {
    ComponentLibs,
    EditorPan,
    AttrEdit,
    PageAttrEdit,
    ControlBar,
    PreviewWrapper,
    CommonAttrEdit
  },
  data() {
    return {
      showPreview: false,
      canvasConfig: {
        scale: 1
      }
    }
  },
  props: {
    customComps: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementsUUID: (state) => state.editor.activeElementsUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID
    })
  },
  created() {
    this.$store.dispatch('setPageData')
    this.$store.dispatch('setActiveElementUUID', '')
  },
  methods: {
    /**
     * @description: 该方法用于导出生成的模版数据，供外部调用
     * @param {*}
     * @return {*}
     */
    saveDesignerData() {
      this.$emit('saveDesignerData', {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
      })
    },
    /**
     * @description: 该方法提供给外部调用，可以根据数据结构更新当前模版----导入或复用可用此方法
     * @param {*} pageData
     * @return {*}
     */
    resetPage(pageData) {
      this.$store.dispatch('setActiveElementUUID', '')
      const {
        pageType,
        radio,
        totalPages,
        elements,
        width,
        fixedHeader,
        fixedFooter,
        customWidth,
        customHeight
      } = pageData
      this.pageData.customWidth = customWidth
      this.pageData.customHeight = customHeight
      this.pageData.fixedFooter = fixedFooter
      this.pageData.fixedHeader = fixedHeader
      this.pageData.pageType = pageType
      this.resetPaper(radio, totalPages)
      this.resetEles(elements, width, fixedFooter, fixedHeader)
    },
    resetPaper(radio, totalPages) {
      let width = this.pageData.width
      let height = width * radio
      this.$store.dispatch('updatePages', totalPages)
      this.$store.dispatch('updateCanvasHeight', height)
    },
    resetEles(eles, width = 900, fixedFooter = {}, fixedHeader = {}) {
      this.pageData.elements = []
      let rd = width / this.pageData.width
      this.pageData.fixedFooter = {
        ...fixedFooter,
        height: fixedFooter.height / rd
      }
      this.pageData.fixedHeader = {
        ...fixedHeader,
        height: fixedHeader.height / rd
      }
      eles.forEach((item) => {
        // 处理导入控件的位置，根据当前视窗宽度做换算，高度不处理，因为会产生遮挡hhh
        item.commonStyle.width = item.commonStyle.width / rd
        item.commonStyle.left =
          item.commonStyle.left > 10
            ? item.commonStyle.left / rd
            : item.commonStyle.left
        item.commonStyle.top = item.commonStyle.top / rd
        item.commonStyle.height = item.commonStyle.height / rd
        setTimeout(() => {
          this.$store.dispatch('importElement', item)
        }, 10)
      })
    }
  }
}
</script>

<style lang="scss">
.designer-wrapper {
  display: flex;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  .editor-side-bar {
    width: 55px;
  }
  .editor-page-edit-wrapper {
    width: 260px;
    min-width: 260px;
    padding: 0 1px;
  }
  .editor-main {
    flex: 1;
    overflow: auto;
    width: 0;
    background: #cfd6e6;
    position: relative;
  }
  .el-attr-edit-wrapper {
    min-width: 380px;
    width: 380px;
    padding: 0;
    height: 100%;
    overflow-y: auto;
  }
  .control-bar-wrapper {
    position: fixed;
    right: 400px;
    bottom: 10px;
    z-index: 1000;
    width: 38px;
  }
  .editor-side-bar {
    .el-tabs__item.is-active {
      background: rgba(37, 165, 137, 0.09);
    }
  }
  .el-attr-edit-wrapper {
    .el-tabs {
      height: 100%;
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 10px;
    }
    .el-textarea__inner,
    .el-collapse-item__header,
    .el-collapse-item__wrap,
    .el-input__inner,
    .el-input-number__decrease,
    .el-input-number__increase {
      background-color: transparent;
    }
    .el-collapse-item__header {
      font-size: 15px;
    }
    .el-tabs__content {
      height: calc(100% - 55px);
      & > div {
        height: 100%;
      }
      .attr-edit-inner {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  }
  .swiper-slide {
    padding: 10px;
  }
}
</style>
