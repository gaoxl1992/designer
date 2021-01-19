<!--
 * @Description: 表格设计器
-->
<template>
  <div class="table-designer">
    <!-- 表格模版列表 -->
    <TableTplList :tableTplList="tableTplList"
                  @editTableTpl="editTableTpl"
                  @deleteTableTpl="deleteTableTpl"></TableTplList>
    <!-- 表格编辑器 -->
    <Tinymce ref="editor"
             class="table-designer-tinymce"
             v-model="content"
             @saveContent="save" />
    <el-dialog title="保存"
               :visible.sync="dialogTableVisible">
      <!-- 填写表格模版信息 -->
      <TableTplInfo v-if="dialogTableVisible"
                    :bindAttrList="bindAttrList"
                    :tplName="tplName"
                    :editIndex="editIndex"
                    @submit="submit"
                    @close="close"></TableTplInfo>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '../../plugins/tinymce'
import { createUUID } from '@client/common/js/mUtils'
import 'codemirror/lib/codemirror.css'
import bus from '@/common/js/bus'
import TableTplList from './tableTplList'
import TableTplInfo from './tableTplInfo'
export default {
  name: 'TableDesigner',
  components: {
    Tinymce,
    TableTplList,
    TableTplInfo
  },
  props: {
    tableTplList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      content: '',
      tplName: '',
      innerContent: '',
      bindAttrList: {},
      editIndex: -1
    }
  },
  mounted() {
    bus.$on('initMce', () => {
      this.editIndex = -1
      this.bindAttrList = {}
      this.content = ''
      this.tplName = ''
    })
  },
  methods: {
    /**
     * @description: 编辑模版
     * @param {*} item
     * @return {*}
     */
    editTableTpl(e) {
      console.log(e)
      this.editIndex = e.index
      this.bindAttrList = e.rels
      this.content = e.tpl
      this.tplName = e.name
    },
    /**
     * @description: 删除表格模版
     * @param {*} index
     * @return {*}
     */
    deleteTableTpl(e) {
      this.$emit('deleteTableTpl', e)
    },
    /**
     * @description: 获取编辑器内部数据
     * @param {*}
     * @return {*}
     */
    getContent() {
      this.$refs.editor.getContent()
    },
    /**
     * @description: 保存编辑器内文本，并发送到外部
     * @param {*} e
     * @return {*}
     */
    save(e) {
      if (!e) {
        return
      }
      this.innerContent = e
      this.dialogTableVisible = true
    },
    /**
     * @description: 关闭dialog
     * @param {*}
     * @return {*}
     */
    close() {
      this.innerContent = ''
      this.dialogTableVisible = false
    },
    /**
     * @description: 保存模版信息
     * @param {*} e
     * @return {*}
     */
    submit(e) {
      // 编辑保存
      if (this.editIndex !== -1 && e.index !== -1) {
        this.$emit('saveEdit', {
          tpl: this.innerContent,
          name: e.name,
          id: this.tableTplList[this.editIndex].id,
          rels: e.rels,
          index: this.editIndex
        })
      } else {
        let id = createUUID()
        this.$emit('saveContent', {
          tpl: this.innerContent,
          name: e.name,
          id,
          rels: e.rels
        })
      }
      this.innerContent = ''
      this.dialogTableVisible = false
    }
  }
}
</script>
<style lang="scss">
.table-designer {
  position: relative;
  display: flex;
  flex-direction: row;
  .table-designer-tinymce {
    flex: 1;
  }
  .tox .tox-dialog {
    top: 50%;
  }
}
</style>