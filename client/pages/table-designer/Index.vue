<!--
 * @Description: 表格设计器
-->
<template>
  <div class="table-designer">
    <div class="tpl-list">
      <p>表格模版列表(双击重新编辑)</p>
      <div class="tpl-item"
           v-for="(item, index) in tableTplList"
           :key="item.id">
        <el-tooltip class="item"
                    effect="dark"
                    :content="item.name"
                    placement="top-start">
          <div class="tpl-item-name"
               @dblclick="editTableTpl(item, index)">{{item.name}}</div>
        </el-tooltip>
        <i class="el-icon-close"
           @click="deleteTableTpl(index)"></i>
      </div>
    </div>
    <Tinymce ref="editor"
             class="tpl-tinymce"
             v-model="content"
             @saveContent="save" />
    <el-dialog title="保存"
               :visible.sync="dialogTableVisible">
      <template>
        <div class="tpl-name">
          <p>模版名称</p>
          <el-input v-model="tplName"></el-input>
        </div>
        <div class="tpl-name"
             v-if="options && options.length">
          <p>添加关联</p>
          <el-select v-model="bindAttr"
                     placeholder="选择属性">
            <el-option v-for="item in options"
                       :key="item"
                       :label="item"
                       :value="item">
            </el-option>
          </el-select>
          <el-select v-model="bindRel"
                     placeholder="选择关联关系">
            <el-option v-for="(value, key) in tableRelations"
                       :key="key"
                       :label="value"
                       :value="key">
            </el-option>
          </el-select>
          <el-input v-model="bindValue" />
          <el-button type="primary"
                     :disabled="!bindAttr || !bindRel || !bindValue"
                     icon="el-icon-plus"
                     @click="addAttr"
                     circle></el-button>
        </div>
        <div class="bind-attrs"
             v-if="Object.keys(bindAttrList).length">
          <p>关联条件</p>
          <div v-for="(values, key) in bindAttrList"
               class="attr-item"
               :key="key">
            {{key}}
            <span v-for="(v, k) in values"
                  :key="k">
              <span class="attr-item-rel">{{tableRelations[k]}}</span> {{v}}
              <i class="el-icon-close"
                 @click="deleteRel(key, k)"></i>
            </span>
            <i class="el-icon-delete"
               @click="deleteAttr(key)"></i>
          </div>
        </div>
        <div class="btn">
          <el-button type="primary"
                     :disabled="!tplName"
                     @click="onSubmit">保存模版</el-button>
          <el-button type="primary"
                     v-if="editIndex!==-1"
                     :disabled="!tplName"
                     @click="submitAsNew">另存为新模版</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import Tinymce from '../../plugins/tinymce'
import { createUUID } from '@client/common/js/mUtils'
import 'codemirror/lib/codemirror.css'
import { tableRelations } from '@client/config/attr-config'
import Vue from 'vue'
import bus from '@/common/js/bus'
export default {
  name: 'TableDesigner',
  components: {
    Tinymce
  },
  props: {
    tableTplList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      content: '',
      dialogTableVisible: false,
      tplName: '',
      innerContent: '',
      options: ['attr1', 'attr2', 'attr3', 'attr4'], // mock
      tableRelations,
      bindAttr: '',
      bindRel: '',
      bindValue: '',
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
    editTableTpl(item, index) {
      this.bindAttrList = item.rels
      this.content = item.tpl
      this.tplName = item.name
      this.editIndex = index
    },
    /**
     * @description: 删除表格模版
     * @param {*} index
     * @return {*}
     */
    deleteTableTpl(index) {
      this.$emit('deleteTableTpl', index)
    },
    /**
     * @description: 删除绑定属性
     * @param {*} key
     * @return {*}
     */
    deleteAttr(key) {
      Vue.delete(this.bindAttrList, key)
    },
    /**
     * @description: 删除绑定关系
     * @param {*} key
     * @param {*} k
     * @return {*}
     */
    deleteRel(key, k) {
      let obj = {
        ...this.bindAttrList[key]
      }
      Vue.delete(this.bindAttrList, key)
      Vue.delete(obj, k)
      if (Object.keys(obj).length) {
        this.bindAttrList[key] = obj
      }
    },
    /**
     * @description: 新增属性
     * @param {*}
     * @return {*}
     */
    addAttr() {
      // 判断同一字段的关联条件是否冲突,冲突后者覆盖前者 todo

      // 校验填写值是否匹配当前条件 todo

      let attr = this.bindAttrList[this.bindAttr] || {}
      attr[this.bindRel] = this.bindValue
      this.bindAttrList[this.bindAttr] = attr

      this.bindAttr = ''
      this.bindRel = ''
      this.bindValue = ''
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
     * @description: 提交模版数据
     * @param {*}
     * @return {*}
     */
    onSubmit() {
      // 编辑保存
      if (this.editIndex !== -1) {
        this.$emit('saveEdit', {
          tpl: this.innerContent,
          name: this.tplName,
          id: this.tableTplList[this.editIndex].id,
          rels: this.bindAttrList,
          index: this.editIndex
        })
        this.innerContent = ''
        this.dialogTableVisible = false
      } else {
        this.submitAsNew()
      }
    },
    submitAsNew() {
      // 给每一个表格模版生成一个id
      let id = createUUID()
      this.$emit('saveContent', {
        tpl: this.innerContent,
        name: this.tplName,
        id,
        rels: this.bindAttrList
      })
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
  .tpl-list {
    width: 280px;
    padding: 10px;
    p {
      padding: 10px 0;
      font-weight: 500;
    }
    .tpl-item {
      padding: 10px 0;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .tpl-item-name {
        max-width: 240px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .tpl-tinymce {
    flex: 1;
  }
  .tox .tox-dialog {
    top: 50%;
  }
  .tpl-name {
    display: flex;
    line-height: 40px;
    margin: 10px 0;
    p {
      min-width: 80px;
      white-space: nowrap;
    }
    .el-select,
    .el-input {
      padding-right: 5px;
    }
  }
  .btn {
    text-align: right;
  }
  .bind-attrs {
    .attr-item {
      width: 100%;
      text-overflow: ellipsis;
      max-width: 100%;
      padding: 10px;
      overflow: hidden;
    }
    .el-icon-delete {
      color: #77a8d1;
      float: right;
    }
    .attr-item-rel {
      color: #f56c6c;
    }
    .el-icon-close {
      color: #77a8d1;
    }
  }
}
</style>