<!--
 * @Description: 设计器主入口
-->
<template>
  <div class="page-layout">
    <!-- 入口 -->
    <div class="page-layout-header"
         id="page-header">
      <el-tabs v-model="activeName">
        <el-tab-pane label="表格设计器"
                     name="tableDesigner"></el-tab-pane>
        <el-tab-pane label="报告设计器"
                     name="designer"></el-tab-pane>
        <el-tab-pane label="编辑器"
                     name="edit"></el-tab-pane>
        <el-tab-pane label="预览"
                     name="preview"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 页面操作区 -->
    <div class="page-layout-ops">
      <template v-if="activeName === 'designer'">
        <el-button @click="saveDesigner"
                   type="primary"
                   size="mini">保存</el-button>
        <el-button @click="importDesigner"
                   type="primary"
                   size="mini">导入上一次编辑</el-button>
      </template>
      <template v-if="activeName === 'edit'">
        <el-button @click="importEditorTpl"
                   type="primary"
                   size="mini">导入模板打开编辑器</el-button>
        <el-button @click="reeditTpl"
                   type="primary"
                   size="mini">继续编辑</el-button>
        <el-button @click="saveEditor"
                   type="primary"
                   size="mini">保存</el-button>
      </template>
      <template v-if="activeName === 'tableDesigner'">
        <el-button @click="saveTableTpl"
                   type="primary"
                   size="mini">保存</el-button>
      </template>
    </div>
    <!-- 页面主题 -->
    <TableDesigner ref="tableDesigner"
                   :tableTplList="tpls"
                   v-if="activeName === 'tableDesigner'"
                   @saveContent="saveTable"
                   @saveEdit="saveEditTable"
                   @deleteTableTpl="deleteTableTpl"></TableDesigner>
    <Designer ref="designer"
              @saveDesignerData="fetchDesignerData"
              v-if="activeName === 'designer'"
              :customComps="customComp"></Designer>
    <Editor ref="editor"
            v-if="activeName === 'edit'"
            @updateSpChars="updateSpChars"
            :tpls="tpls"
            @saveEditor="saveEditedPage"></Editor>
    <Preview :tplStr="pageTpl"
             ref="preview"
             v-if="activeName === 'preview'"></Preview>
  </div>
</template>
<script>
import Designer from './designer/Index'
import Editor from './editor/Index'
import TableDesigner from './table-designer/Index'
import Preview from './preview/Index'
import bus from '@/common/js/bus'
export default {
  data() {
    return {
      activeName: 'designer',
      pageHistory: {},
      customComp: () => [],
      tpls: () => [],
      pageTpl: ''
    }
  },
  components: {
    Designer,
    Editor,
    TableDesigner,
    Preview
  },
  created() {
    // 模拟检查数据，塞到window下
    window.mockData = {
      attr1: 4,
      attr2: 6,
      attr3: 'abcdefg',
      attr4: 5
    }
    // 定制组件数据，首次通过mock存入localstorage，模拟数据库存储规则
    this.customComp = JSON.parse(localStorage.getItem('customComp'))
    this.tpls = localStorage.getItem('tableTemplate')
      ? JSON.parse(localStorage.getItem('tableTemplate'))
      : []
    if (localStorage.getItem('editedPageData')) {
      let pageData = JSON.parse(localStorage.getItem('editedPageData'))
      this.pageTpl = pageData.header + pageData.bodyTpl + pageData.footer
    }
  },
  mounted() {
    // 通过全局bus更新常用组件列表，模拟接口
    bus.$on('updateComps', (comps) => {
      this.customComp = JSON.parse(JSON.stringify(comps))
      localStorage.setItem('customComp', JSON.stringify(this.customComp))
    })
  },
  methods: {
    /**
     * @description: 删除表格模版
     * @param {*} e
     * @return {*}
     */
    deleteTableTpl(e) {
      this.tpls.splice(e, 1)
      localStorage.setItem('tableTemplate', JSON.stringify(this.tpls))
    },
    /**
     * @description: 编辑表格时保存
     * @param {*} e
     * @return {*}
     */
    saveEditTable(e) {
      let templist = this.tpls || []
      const { index, tpl, name, id, rels } = e
      templist.splice(index, 1, {
        tpl,
        name,
        id,
        rels
      })

      localStorage.setItem('tableTemplate', JSON.stringify(templist))
      this.tpls = templist
    },
    /**
     * @description:  调用接口保存表格编辑器内容
     * @param {*} e
     * @return {*}
     */
    saveTable(e) {
      let templist = this.tpls || []

      if (!e) {
        return
      }
      templist.push(e)

      localStorage.setItem('tableTemplate', JSON.stringify(templist))
      this.tpls = templist
    },
    /**
     * @description: 保存表格模版编辑器中的内容
     * @param {*}
     * @return {*}
     */
    saveTableTpl() {
      this.$refs.tableDesigner.getContent()
    },
    /**
     * @description: 保存编辑器编辑的内容
     * @param {*}
     * @return {*}
     */
    saveEditor() {
      // 编辑态保存数据
      this.$refs.editor.save()
    },
    /**
     * @description: 调用接口保存编辑状态的内容
     * @param {*} e
     * @return {*}
     */
    saveEditedPage(e) {
      localStorage.setItem('editedPageData', JSON.stringify(e))
    },
    /**
     * @description: 调用接口更新特殊字符集
     * @param {*} e
     * @return {*}
     */
    updateSpChars(e) {
      // 当特殊字符发生变更
      localStorage.setItem('chars', JSON.stringify(e))
    },
    /**
     * @description: 编辑一半的报告导入继续编辑
     * @param {*}
     * @return {*}
     */
    reeditTpl() {
      this.pageHistory = JSON.parse(
        localStorage.getItem('editedPageData')
      ).editedData
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageHistory, chars)
    },
    /**
     * @description: 导入设计完成的模版
     * @param {*}
     * @return {*}
     */
    importEditorTpl() {
      this.pageHistory = JSON.parse(localStorage.getItem('pageData'))
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageHistory, chars)
    },
    /**
     * @description: 调用接口保存设计模版数据
     * @param {*} e
     * @return {*}
     */
    fetchDesignerData(e) {
      // TODO
      localStorage.setItem('pageData', JSON.stringify(e))
    },
    /**
     * @description: 调用内部暴露的saveDesignerData方法将设计器的数据发送到父组件
     * @param {*}
     * @return {*}
     */
    saveDesigner() {
      this.$refs.designer.saveDesignerData()
    },
    /**
     * @description: 导入设计模版，继续设计
     * @param {*}
     * @return {*}
     */
    importDesigner() {
      this.pageHistory = JSON.parse(localStorage.getItem('pageData'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.designer.resetPage(this.pageHistory)
    }
  },
  watch: {
    activeName(val) {
      if (val === 'preview') {
        if (localStorage.getItem('editedPageData')) {
          let pageData = JSON.parse(localStorage.getItem('editedPageData'))
          this.pageTpl = pageData.header + pageData.bodyTpl + pageData.footer
        }
      }
    }
  }
}
</script>
<style lang="scss">
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .page-layout-ops {
    position: absolute;
    height: 50px;
    line-height: 50px;
    z-index: 1000;
    right: 50px;
  }
  .page-layout-header {
    height: 50px;
    background: #a5afc7;
    display: flex;
    width: 100%;
    z-index: 999;
    justify-content: center;
  }
  .designer-wrapper,
  .editor-preview {
    flex: 1;
  }
  .iframe-wrapper {
    margin-top: 60px !important;
  }
  .cloase-btn {
    top: 68px !important;
  }
}
</style>
