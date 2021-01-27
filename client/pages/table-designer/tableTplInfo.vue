<!--
 * @Description: 保存弹窗内容，填写模版信息
 * @props: 
 *  tplName - 模版名称
 *  bindAttrList - 关联条件 Array
 *  editIndex - 当前项
-->
<template>
  <div class="tpl-info">
    <!-- 模版名称 -->
    <div class="tpl-info-item">
      <p>模版名称</p>
      <el-input v-model="tempTplName"></el-input>
    </div>
    <div class="tpl-info-item"
         v-for="(value, key) in extent"
         :key="key">
      <p>{{ value.name }}</p>
      <el-select v-model="value.option"
                 placeholder="请选择">
        <el-option v-for="item in value.options"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
        </el-option>
      </el-select>
    </div>
    <!-- 操作按钮 -->
    <div class="tpl-info-btn">
      <el-button type="primary"
                 :disabled="!tempTplName"
                 @click="onSubmit">保存模版</el-button>
      <el-button type="primary"
                 v-if="editIndex!==-1"
                 :disabled="!tempTplName"
                 @click="onSubmit(-1)">另存为新模版</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
import { tableRelations } from '@/config/attr-config'
import Vue from 'vue'
export default {
  name: 'TableTplInfo',
  props: {
    tplName: {
      type: String,
      default: ''
    },
    bindAttrList: {
      type: Object,
      default: () => { }
    },
    editIndex: {
      type: Number,
      default: -1
    },
    extent: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      options: ['attr1', 'attr2', 'attr3', 'attr4'], // mock
      bindAttr: '',
      tableRelations,
      bindRel: '',
      bindValue: '',
      attrsList: () => { },
      tempTplName: ''
    }
  },
  created () {
    this.attrsList = this.bindAttrList
    this.tempTplName = this.tplName
  },
  methods: {
    /**
     * @description: 删除绑定属性
     * @param {*} key
     * @return {*}
     */
    deleteAttr (key) {
      Vue.delete(this.attrsList, key)
    },
    /**
     * @description: 删除绑定关系
     * @param {*} key
     * @param {*} k
     * @return {*}
     */
    deleteRel (key, k) {
      let obj = {
        ...this.attrsList[key]
      }
      Vue.delete(this.attrsList, key)
      Vue.delete(obj, k)
      if (Object.keys(obj).length) {
        this.attrsList[key] = obj
      }
    },
    /**
     * @description: 新增属性
     * @param {*}
     * @return {*}
     */
    addAttr () {
      // todo
      let attr = this.attrsList[this.bindAttr] || {}

      // 当前属性一绑定关联条件
      // if (attr) {
      //   let val = attr[this.bindRel]
      // }
      attr[this.bindRel] = this.bindValue
      this.attrsList[this.bindAttr] = attr

      this.resetData()
    },
    /**
     * @description: 提交模版数据
     * @param {*}
     * @return {*}
     */
    onSubmit (index) {
      let obj = {
        name: this.tempTplName,
        extent: this.extent
      }
      if (index === -1) {
        obj.index = -1
      }

      this.resetData()
      this.$emit('submit', obj)
    },
    /**
     * @description: 关闭dialog
     * @param {*}
     * @return {*}
     */
    close () {
      this.resetData()
      this.$emit('close')
    },
    resetData () {
      this.bindAttr = ''
      this.bindRel = ''
      this.bindValue = ''
    }
  }
}
</script>
<style lang="scss">
.tpl-info {
  .tpl-info-attrs {
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
  .tpl-info-item {
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
  .tpl-info-btn {
    text-align: right;
  }
  .attr-rel {
    padding: 10px;
  }
  .el-icon-plus {
    font-size: 20px;
    line-height: 36px;
    &:hover {
      color: #409eff;
      cursor: pointer;
    }
  }
}
</style>
