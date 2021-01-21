<!--
 * @Description: 设计器主入口
-->
<template>
  <div class="page-layout">
    <!-- 入口tab -->
    <div id="page-header"
         class="page-layout-header">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(value, key) in tabs"
                     :key="key"
                     :label="value"
                     :name="key"></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 页面操作区 -->
    <div class="page-layout-ops">
      <template v-for="(value, key) in ops">
        <div :key="key"
             v-if="activeName === key">
          <el-button v-for="(v, k) in value"
                     :key="k"
                     @click="v.clickFn"
                     type="primary"
                     size="mini">{{ v.label }}</el-button>
        </div>
      </template>
    </div>
    <!-- 页面主题 -->
    <keep-alive>
      <component :is="activeName"
                 :tableTplList="tpls"
                 @saveEdit="saveTable"
                 @deleteTableTpl="deleteTableTpl"
                 :customComps="customComp"
                 :tpls="tpls"
                 @updateSpChars="updateSpChars"
                 @saveEditor="saveEditedPage"
                 :tplStr="pageTpl"
                 :ref="activeName"></component>
    </keep-alive>
  </div>
</template>
<script>
import Designer from './designer/Designer.vue'
import Editor from './editor/Editor.vue'
import TableDesigner from './table-designer/TableDesigner.vue'
import Preview from './preview/Preview.vue'
import bus from '@/utils/bus'
import { tabs, ops } from './lay-config'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      activeName: 'designer',
      pageDataHis: {},
      customComp: () => [],
      tpls: () => [],
      pageTpl: '',
      tabs,
      ops: ops(this)
    }
  },
  components: {
    Designer,
    Editor,
    TableDesigner,
    Preview
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData
    })
  },
  created () {
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
  mounted () {
    // 通过全局bus更新常用组件列表，模拟接口
    bus.$on('updateComps', (comps) => {
      this.customComp = JSON.parse(JSON.stringify(comps))
      localStorage.setItem('customComp', JSON.stringify(this.customComp))
    })
  },
  methods: {
    /** 表格操作 start */
    /**
     * @description: 删除表格模版
     * @param {*} e
     * @return {*}
     */
    deleteTableTpl (e) {
      this.tpls.splice(e, 1)
      localStorage.setItem('tableTemplate', JSON.stringify(this.tpls))
    },
    /**
     * @description:  调用接口保存表格编辑器内容
     * @param {*} e
     * @return {*}
     */
    saveTable (e) {
      let templist = this.tpls || []

      if (!e) {
        return
      }

      const { index, tpl, name, id, rels } = e
      const obj = {
        tpl,
        name,
        id,
        rels
      }
      if (index === -1) {
        templist.push(obj)
      } else {
        templist.splice(index, 1, obj)
      }

      localStorage.setItem('tableTemplate', JSON.stringify(templist))
      this.tpls = templist
    },
    /**
     * @description: 保存表格模版编辑器中的内容
     * @param {*}
     * @return {*}
     */
    saveTableTpl () {
      this.$refs.tableDesigner.getContent()
    },
    /*** 表格操作 end */

    /*** 编辑器操作 start */
    /**
     * @description: 保存编辑器编辑的内容
     * @param {*}
     * @return {*}
     */
    saveEditor () {
      // 编辑态保存数据
      this.$refs.editor.save()
    },
    /**
     * @description: 调用接口保存编辑状态的内容
     * @param {*} e
     * @return {*}
     */
    saveEditedPage (e) {
      localStorage.setItem('editedPageData', JSON.stringify(e))
    },
    /**
     * @description: 调用接口更新特殊字符集
     * @param {*} e
     * @return {*}
     */
    updateSpChars (e) {
      // 当特殊字符发生变更
      localStorage.setItem('chars', JSON.stringify(e))
    },
    /**
     * @description: 编辑一半的报告导入继续编辑
     * @param {*}
     * @return {*}
     */
    reeditTpl () {
      this.pageDataHis = JSON.parse(
        localStorage.getItem('editedPageData')
      ).editedData
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageDataHis, chars)
    },
    /**
     * @description: 导入设计完成的模版
     * @param {*}
     * @return {*}
     */
    importEditorTpl () {
      this.pageDataHis = JSON.parse(localStorage.getItem('pageData'))
      console.log(this.pageDataHis)
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))

      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageDataHis, chars)
    },
    /*** 编辑器操作 end */

    /*** 设计器操作 start */
    /**
     * @description: 调用内部暴露的saveDesignerData方法将设计器的数据发送到父组件
     * @param {*}
     * @return {*}
     */
    saveDesigner () {
      this.$refs.designer.saveDesignerData()
      // TODO API 保存设计obj
      localStorage.setItem('pageData', JSON.stringify(this.pageData))
    },
    /**
     * @description: 导入设计模版，继续设计
     * @param {*}
     * @return {*}
     */
    importDesigner () {
      this.pageDataHis = JSON.parse(localStorage.getItem('pageData'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.designer.resetPage(this.pageDataHis)
    }
    /*** 设计器操作 end */
  },
  watch: {
    activeName (val) {
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
