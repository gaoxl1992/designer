<!--
 * @Description: 设计器主容器  控件区+画布区+属性配置区域
 * @props: 
-->
<template>
  <div class="designer-wrapper">
    <!--组件区域-->
    <div class="editor-page-edit-wrapper">
      <ComponentLibs :customComps="customComps" />
    </div>
    <!--页面编辑区域-->
    <div class="editor-main">
      <div class="control-bar-wrapper">
        <ControlBar :scale.sync="canvasConfig.scale"
                    @showPreview="showPreview = true" />
      </div>
      <EditorPan :scale.sync="canvasConfig.scale" />
    </div>
    <!--属性编辑区域-->
    <div class="el-attr-edit-wrapper scrollbar-wrapper">
      <!-- 点选单个控件 -->
      <template v-if="activeElementUUID">
        <AttrEdit />
      </template>
      <!-- 框选多个控件 -->
      <template v-else-if="activeElementsUUID && activeElementsUUID.length > 1">
        <CommonAttrEdit :uuids="activeElementsUUID" />
      </template>
      <!-- 编辑纸张属性 -->
      <PageAttrEdit v-else />
    </div>
    <!--预览-->
    <PreviewWrapper v-if="showPreview"
                    @closePreview="showPreview = false"
                    :pageData="pageData" />
  </div>
</template>

<script>
import ComponentLibs from './component-libs/Index'
import EditorPan from './editor-panel'
import AttrEdit from './attr-configure/attr-edit'
import PageAttrEdit from './attr-configure/page-attr-edit'
import CommonAttrEdit from './attr-configure/common-attr-edit'
import ControlBar from '@client/components/control-bar'
import PreviewWrapper from '@client/components/preview-wrapper'
import mixin from '@client/mixins/mixin'

export default {
  name: 'Designer',
  componentName: 'Designer',
  components: {
    ComponentLibs,
    EditorPan,
    AttrEdit,
    PageAttrEdit,
    ControlBar,
    PreviewWrapper,
    CommonAttrEdit
  },
  mixins: [mixin],
  data () {
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
  created () {
    this.$store.dispatch('setActiveElementUUID', '')
  },
  methods: {
    /**
     * @description: 外部触发将pageData数据存入store
     * @param {*}
     * @return {*}
     */
    saveDesignerData () {
      this.$store.dispatch('setPageData', {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
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
