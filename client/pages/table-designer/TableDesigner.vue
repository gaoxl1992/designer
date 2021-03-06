<!--
 * @Description: 表格设计器
 * @props:
 *  tableTplList 表格模版列表 Array
-->
<template>
  <div class="table-designer">
    <!-- 表格模版列表 -->
    <TableTplList
      :tableTplList="tableTplList"
      @editTableTpl="editTableTpl"
      @deleteTableTpl="deleteTableTpl"
    />
    <!-- 表格编辑器 -->
    <Tinymce
      ref="editor"
      class="table-designer-tinymce"
      v-model="content"
      @saveContent="save"
    />
    <!-- 填写表格模版信息 -->
    <el-dialog
      title="保存"
      :visible.sync="dialogTableVisible"
    >
      <TableTplInfo
        v-if="dialogTableVisible"
        :bindAttrList="bindAttrList"
        :tplName="tplName"
        :editIndex="editIndex"
        :extent="extent"
        @submit="submit"
        @close="close"
      />
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '../../plugins/tinymce'
import { createUUID } from '@/utils/mUtils'
import 'codemirror/lib/codemirror.css'
import bus from '@/utils/bus'
import TableTplList from './tableTplList'
import TableTplInfo from './tableTplInfo'
import { mapState } from 'vuex'
import '@/common/styles/index.scss'
export default {
  name: 'TableDesigner',
  componentName: 'TableDesigner',
  components: {
    Tinymce,
    TableTplList,
    TableTplInfo
  },
  props: {
    tableTplList: {
      type: Array,
      default: () => []
    },
    extent: {
      type: Object,
      default: () => { }
    }
  },
  inject: ['modelId'],
  computed: {
    ...mapState({
      tplList () {
        let state = this.$store1.state[this.modelId];
        return state?.tableTpl || []
      }
    })
  },
  data () {
    return {
      dialogTableVisible: false,
      content: '',
      tplName: '',
      innerContent: '',
      bindAttrList: {},
      editIndex: -1
    }
  },
  mounted () {
    bus.$on('initMce', () => {
      this.editTableTpl()
    })
  },
  methods: {
    /**
     * @description: 编辑模版
     * @param {*} item
     * @return {*}
     */
    editTableTpl (e = {}) {
      this.editIndex = e.index !== null && e.index >= 0 ? e.index : -1
      this.$emit('editTableTpl', e)
    },
    /**
     * @description: 删除表格模版
     * @param {*} index
     * @return {*}
     */
    deleteTableTpl (e) {
      this.$emit('deleteTableTpl', e)
    },
    /**
     * @description: 外部重置富文本内容
     * @param {*} tplDetail
     * @return {*}
     */
    resetMce (tplDetail) {
      if (tplDetail && tplDetail.id) {
        this.content = tplDetail.content
        this.tplName = tplDetail.title
        if (this.extent && this.extent.department && this.extent.department.option) {
          this.extent.department.option = tplDetail.departmentId
        }
      } else {
        this.content = ''
        this.tplName = ''
      }
    },
    /**
     * @description: 获取编辑器内部数据
     * @param {*}
     * @return {*}
     */
    getContent () {
      this.$refs.editor.getContent()
    },
    /**
     * @description: 保存编辑器内文本，并发送到外部
     * @param {*} e
     * @return {*}
     */
    save (e) {
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
    close () {
      this.innerContent = ''
      this.dialogTableVisible = false
    },
    /**
     * @description: 保存模版信息
     * @param {*} e
     * @return {*}
     */
    submit (e) {
      // 编辑保存
      let id =
        this.editIndex !== -1 && e.index !== -1
          ? this.tableTplList[this.editIndex]?.id
          : createUUID()
      let index = this.editIndex !== -1 && e.index !== -1 ? this.editIndex : -1
      this.$emit('saveEdit', {
        tpl: this.innerContent,
        name: e.name,
        id,
        index,
        extend: e.extent
      })
      this.innerContent = ''
      this.editTableTpl()
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