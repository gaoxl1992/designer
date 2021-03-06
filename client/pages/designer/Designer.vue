<!--
 * @Description: 设计器主容器  控件区+画布区+属性配置区域
-->
<template>
  <div class="designer-wrapper">
    <!--组件区域-->
    <ComponentLibs
      class="designer-lib-wrapper"
      :unableEdit="unableEdit"
      :customComps="customComps"
    />
    <!--页面编辑区域-->
    <div class="editor-main">
      <ControlBar
        class="control-bar-wrapper"
        :scale.sync="canvasConfig.scale"
        @showPreview="showPreview = true"
      />
      <EditorPan :scale.sync="canvasConfig.scale" />
    </div>
    <!--属性编辑区域-->
    <div class="el-attr-edit-wrapper scrollbar-wrapper">
      <!-- 点选单个控件 -->
      <AttrEdit v-if="activeElementUUID && activeElement" :studyData="studyData"/>
      <!-- 框选多个控件 -->
      <CommonAttrEdit
        v-else-if="activeElementsUUID && activeElementsUUID.length > 1"
        :uuids="activeElementsUUID"
      />
      <!-- 编辑纸张属性 -->
      <PageAttrEdit v-else />
    </div>
    <!--预览-->
    <PreviewWrapper
      v-if="showPreview"
      @closePreview="showPreview = false"
      :pageData="pageData"
    />
  </div>
</template>

<script>
import ComponentLibs from './component-libs/Index'
import EditorPan from './editorPanel'
import AttrEdit from './attr-configure/attr-edit'
import PageAttrEdit from './attr-configure/page-attr-edit'
import CommonAttrEdit from './attr-configure/common-attr-edit'
import ControlBar from '@/components/control-bar'
import PreviewWrapper from '@/components/preview-wrapper'
import mixin from '@/mixins/mixin'
import '@/common/styles/index.scss'
import bus from '@/utils/bus'

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
  props: {
    customComps: { // 常用组件
      type: Array,
      default: () => []
    },
    unableEdit: { // 常用组件是否可增删改
      type: Boolean,
      default: false
    },
    studyData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showPreview: false,
      canvasConfig: {
        scale: 1
      },
      tempCacheLength: 0,
      pageType: 'designer'
    }
  },
  created () {
    bus.$on('saveCustomNotDisplayComps', (comps) => {
      this.$emit('saveCustomNotDisplayComps', comps)
    })
  },
  methods: {
    /**
     * @description: 外部新建页面时，如果有未保存操作，则提示
     * @param {*} pageData
     * @param {*} spCharacters
     * @param {*} domainList
     * @return {*}
     */
    conform (pageData = null, spCharacters = [], domainList = []) {
      if (this.tempCacheLength !== this.historyCache.length) {
        this.$confirm(`${pageData?.name || ''}模版内容已更改，是否保存?`, '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存',
          type: 'warning',
          showClose: false,
          closeOnClickModal: false
        }).then(() => {
          this.saveDesignerData()
        }).catch(() => {
          this.tempCacheLength = this.historyCache.length
          this.resetPage(pageData, spCharacters, domainList)
        });
      } else {
        this.resetPage(pageData, spCharacters, domainList)
      }
    },
    /**
     * @description: 外部触发将pageData数据存入store
     * @param {*}
     * @return {*}
     */
    saveDesignerData () {
      if (!this.pageData || !this.pageData.elements || !this.pageData.elements[0]) {
        return
      }
      let obj = {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
      }

      if (!this.pageData.fixedHeader.openFixed) {
        delete obj.fixedHeader
      }
      if (!this.pageData.fixedFooter.openFixed) {
        delete obj.fixedFooter
      }
      delete obj.backgroundImage
      delete obj.backgroundSize
      
      this.$emit('saveDesignerData', obj)
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
  .designer-lib-wrapper {
    width: 260px;
  }
  .editor-main {
    flex: 1;
    overflow: auto;
    width: 0;
    background-color: $page-bg-deepcolor;
    position: relative;
    border: 1px solid $line-color;
    border-width: 0 1px;
    &::-webkit-scrollbar {
      width: 0;
      height: 10px;
      background: transparent !important;
    }
  }
  .el-attr-edit-wrapper {
    min-width: 260px;
    width: 260px;
    padding: 0;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .control-bar-wrapper {
    position: fixed;
    right: 290px;
    bottom: 330px;
    z-index: 20;
    width: 38px;
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
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
}
</style>
