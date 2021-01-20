<template>
  <el-dialog :visible="dialogVisible"
             @close="cancel">
    <div class="cus-comps-setting-title"
         slot="title">
      常用组件
      <el-popover placement="bottom"
                  title="新建组件"
                  width="400"
                  v-model="addDialogVisible"
                  trigger="manual">
        <el-form :model="element"
                 size="mini"
                 :inline="true"
                 label-position="right"
                 label-width="95px"
                 :rules="rules"
                 ref="element">
          <el-form-item label="标题"
                        prop="title">
            <el-input v-model="element.title"></el-input>
          </el-form-item>
          <el-form-item label="控件类型"
                        prop="elName">
            <el-select v-model="element.elName"
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类"
                        prop="type">
            <el-input v-model="element.type"></el-input>
          </el-form-item>
          <el-form-item label="阈值"
                        prop="threshold">
            <el-input v-model="element.threshold"></el-input>
          </el-form-item>
          <el-form-item size="mini"
                        class="btn-group">
            <el-button type="primary"
                       @click="onSubmit('element')">确定</el-button>
            <el-button @click="addDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
        <el-button slot="reference"
                   type="text"
                   size="mini"
                   @click="addDialogVisible = true">
          <i class="el-icon-plus"></i>新增组件
        </el-button>
      </el-popover>
    </div>
    <el-form class="comps-setting">
      <el-form-item v-for="(item, index) in compsList"
                    :key="index"
                    class="clearfix">
        <div class="cus-components-libs-title">
          <div>{{ item.title }}</div>
        </div>
        <span class="cus-components-lib-item"
              v-for="(el, i) in item.components"
              :key="i">
          <el-checkbox v-model="el.display">
            {{el.title}}
            <i class="el-icon-remove"
               @click="removeCusComp(index, i)"></i>
          </el-checkbox>
        </span>
      </el-form-item>
    </el-form>
    <span class="btn-group"
          slot="footer">
      <el-button @click="confirm"
                 type="primary"
                 size="mini">确定</el-button>
      <el-button @click="cancel"
                 size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import bus from '@/utils/bus'
import { compsLibs } from '@client/config/attr-config'
export default {
  name: 'CusCompsSetting',
  props: {
    customComps: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      compsList: () => [],
      addDialogVisible: false,
      element: () => {},
      options: compsLibs,
      rules: () => []
    }
  },
  created() {
    this.compsList = JSON.parse(JSON.stringify(this.customComps)) || []
    this.dialogVisible = true
    this.element = {}
    this.rules = {
      title: [{ required: true, message: '请输入组件标题', trigger: 'blur' }],
      elName: [
        { required: true, message: '请选择控件类型', trigger: 'change' }
      ],
      threshold: [
        {
          validator: (rule, value, callback) => {
            setTimeout(() => {
              if (
                !new RegExp(
                  '^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$'
                ).test(value)
              ) {
                callback(new Error('只能输入字母数字或_'))
              } else {
                callback()
              }
            })
          },
          trigger: 'blur'
        }
      ]
    }
  },
  methods: {
    /**
     * @description: 新建组件保存
     * @param {*} ele
     * @return {*}
     */
    onSubmit(ele) {
      this.$refs[ele].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let index = -1
          this.element.type = this.element.type || '其他'
          if (this.compsList && this.compsList.length) {
            for (let i = 0; i < this.compsList.length; i++) {
              if (this.compsList[i].title === this.element.type) {
                index = i
                break
              }
            }
          }
          if (index === -1) {
            index = 0
            this.compsList.push({
              title: this.element.type,
              components: []
            })
          }
          this.compsList[index].components.push(this.element)
          this.element = {}
          this.addDialogVisible = false
        }
      })
    },
    /**
     * @description: 移除常用组件
     * @param {*} index
     * @param {*} i
     * @return {*}
     */
    removeCusComp(index, i) {
      this.compsList[index].components.splice(i, 1)
    },
    /**
     * @description: 保存组件
     * @param {*}
     * @return {*}
     */
    confirm() {
      this.dialogVisible = false
      bus.$emit('updateComps', this.compsList)
      this.$emit('close')
    },
    /**
     * @description: 取消操作
     * @param {*}
     * @return {*}
     */
    cancel() {
      if (JSON.stringify(this.customComps) !== JSON.stringify(this.compsList)) {
        this.$confirm('检测到您有未保存的变更，是否关闭？', '确认', {
          confirmButtonText: '关闭',
          cancelButtonText: '保存并关闭'
        })
          .then(() => {
            this.dialogVisible = false
            this.$emit('close')
          })
          .catch(() => {
            this.confirm()
          })
      } else {
        this.dialogVisible = false
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss">
.el-divider--horizontal {
  margin: 16px 0;
}
.cus-components-libs-title {
  line-height: 22px;
}
.cus-components-lib-item {
  padding-right: 10px;
  position: relative;
  .el-checkbox {
    margin-right: 0px;
  }
}
.el-icon-remove {
  color: #0a68b3;
  padding-bottom: 10px;
}
.el-icon-remove:before {
  position: absolute;
  right: -7px;
  opacity: 0.7;
  top: 3px;
  font-size: 10px;
  content: '\E7A2';
}
.btn-group {
  text-align: center;
}
</style>