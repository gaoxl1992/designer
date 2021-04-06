<template>
  <div
    class="components-attr-edit"
    v-if="activeElement"
  >
    <AreaTitle
      :title="activeElement.title"
      desc="可修改内容，设置显示效果"
    />
    <div class="attr-edit-inner">
      <div class="props-attr-style">
        <propsAttr></propsAttr>
      </div>
      <div class="common-attr-style" @change="haveChanges">
        <p class="attr-item-title">域值</p>
        <el-select
          v-model="activeElement.threshold"
          placeholder="请选择"
          size="mini"
          clearable
          ref="singleSelect"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-circle-plus-outline"
            @click.stop="openaddFieldDialog"
          ></i>
          <el-option
            v-for="item in domainList"
            :key="item.option"
            :label="'#' + item.name + ' ' + item.option"
            :value="item.option"
          >
          </el-option>
        </el-select>
        <el-button
          :type="activeElement.threshold ? 'primary' : ''"
          plain
          size="small"
          @click="showDialog = true"
        ><i class="el-icon-edit"></i>编辑事件</el-button>
        <el-checkbox
          class="hidden-on-print"
          v-model="activeElement.hideOnPrint"
        >打印隐藏</el-checkbox>
        <baseAttr></baseAttr>
      </div>
    </div>
    <el-dialog
      :visible.sync="showDialog"
      custom-class="codemirror-index"
      @close="closeDialog"
    >
      <template slot="title">
        {{ '编辑事件 ' + (activeElement.threshold ? ('#' + activeElement.threshold) : '（无域值）')  }}
      </template>
      <template>
        <el-button
          type="text"
          @click="showDemoDrawer=true"
        >
          查看全部可操作属性和Demo
        </el-button>
        <codemirror v-if="showDialog"
          class="mirror"
          v-model="code"
          :options="cmOptions"
        />
      </template>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="mini"
          type="primary"
          @click="confirmDialog"
        >确认</el-button>
        <el-button
          size="mini"
          @click="closeDialog"
        >取消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加域值"
      :visible.sync="dialogVisible"
      custom-class="add-field-dialog"
      :close-on-click-modal="false"
      :append-to-body="true"
      @closed="handleClose"
    >
      <div class="field">
        <label>域值名：</label>
        <el-input
          v-model="fieldName"
          placeholder="请输入域值名"
          size="small"
          class="field-name"
        ></el-input>
      </div>
      <div class="radio-style">
        <el-radio
          :label="1"
          v-model="radio"
        >存储数据</el-radio>
        <el-radio
          :label="2"
          v-model="radio"
        >临时显示</el-radio>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="transmiteValue"
        >确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <el-drawer
      title="脚本指南"
      :visible.sync="showDemoDrawer"
      direction="rtl"
      :modal="false"
    >
      <AttrScript :busiStudyData="studyData"></AttrScript>
    </el-drawer>
  </div>
</template>

<script>
import BaseAttr from './attr-props-components/base-attr'
import PropsAttr from './attr-props-components/props-attr/index.vue'
import AttrScript from './attr-script-preset/attr-script'
import { codemirror } from 'vue-codemirror'
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/indent-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');
import { mapState, mapGetters } from 'vuex'
import AreaTitle from '@/components/area-title'

export default {
  props: {
    studyData: {
      type: String,
      default: ''
    }
  },
  components: {
    BaseAttr,
    PropsAttr,
    codemirror,
    AreaTitle,
    AttrScript
  },
  data () {
    return {
      code: '',
      showDialog: false,
      cmOptions: {
        readOnly: false,
        tabSize: 2,
        indentUnit: 2,
        mode: 'text/javascript',
        lineNumbers: true,
        line: true,
        smartIndent: true
      },
      showAdd: false,
      dialogVisible: false,
      fieldName: '',
      radio: 1,
      domainList: [],
      showDemoDrawer: false
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData
    }),
    ...mapGetters(['activeElementIndex', 'activeElement'])
  },
  created () {
    this.code = this.activeElement?.script
    this.domainList = JSON.parse(JSON.stringify(this.pageData.domainList))
  },
  watch: {
    'activeElement.threshold' (val) {
      if (val) {
        this.activeElement.threshold = val.replace(/[^\w]/gi, '')
      }
    },
    'activeElement.script' (val) {
      this.code = val
    }
  },
  methods: {
    haveChanges() {
      this.$store.dispatch('addHistoryCache')
    },
    handleClose () {
      this.fieldName = ''
      this.radio = 1
    },
    openaddFieldDialog () {
      this.dialogVisible = true
      this.$refs.singleSelect.blur()
    },
    confirmDialog () {
      this.activeElement.script = this.code.replace(/\/\*[\s\S]*?\*\//ig, '').replace(/ +/g, '').replace(/[\r\n]/g, '').trim()
      this.closeDialog()
    },
    closeDialog () {
      this.code = this.activeElement.script
      this.showDemoDrawer = false
      this.showDialog = false
    },
    /**
     * @description: 非数据库阈值转换
     * @param {*}
     * @return {*}
     */
    transmiteValue () {
      // 添加的域值不为空
      if (this.fieldName && this.fieldName.trim()) {
        let fieldPre = (this.radio === 1 ? 'PROP_' : 'TEMP_')
        this.activeElement.threshold = this.fieldVal = fieldPre + this.fieldName.trim()
        this.dialogVisible = false
      } else {
        this.$message({
          message: '域值名不能为空！',
          type: 'error',
          showClose: true,
        })
      }
    }
  }
}
</script>
<style lang="scss">
.components-attr-edit {
  height: 100%;
  .el-icon-edit {
    padding-right: 10px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .attr-title {
    font-weight: bold;
  }
  .common-attr-style {
    .el-form-item {
      margin-bottom: 10;
    }
    .el-button--default {
      width: 100%;
    }
  }
  .attr-edit-inner {
    padding: 16px 10px;
    margin-bottom: 50px;
  }
  .attr-header {
    font-size: 14px;
    font-weight: 500;
    padding: 20px 10px 10px 10px;
    color: $font-color-base;
    line-height: 22px;
    .attr-header-desc {
      font-weight: 400;
      color: #707070;
      line-height: 22px;
      padding-top: 4px;
    }
  }
  .attr-header-line {
    height: 1px;
    width: 100%;
    background-color: #adb1b8;
  }
  .el-form-item__label {
    font-weight: 500;
    color: $font-color-base;
    font-size: 14px;
  }
  .props-attr-style {
    .el-input {
      width: auto;
    }
  }
  .common-attr-style {
    .el-icon-circle-plus-outline {
      position: absolute;
      right: 30px;
      height: 22px;
      font-size: 16px;
      color: #0a68b3;
      cursor: pointer;
      bottom: 0;
    }
    .el-input__prefix {
      position: relative;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 10px;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 50px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .outlook-group-item {
      .el-input--suffix .el-input__inner {
        padding-right: 15px;
      }
    }
    .el-select {
      width: 100%;
    }
    .el-button {
      margin-top: 10px;
      margin-bottom: 20px;
      width: 100%;
    }
    .hidden-on-print {
      padding-bottom: 20px;
      position: relative;
      width: 100%;
      &::after {
        content: ' ';
        width: 100%;
        height: 1px;
        display: inline-block;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: $border-color;
      }
    }
  }
  .attr-item-title {
    height: 30px;
    line-height: 30px;
    text-align: left;
    min-width: 60px;
    font-size: 14px;
    padding-bottom: 4px;
    color: $font-color-base;
    font-weight: 500;
  }
}
.field {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
  label {
    width: 80px;
  }
}
</style>