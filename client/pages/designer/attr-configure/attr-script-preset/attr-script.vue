<!--
 * @Description: 脚本指南弹出层内容
-->
<template>
  <div class="attr-script">
    <el-tabs v-model="activeName">
      <el-tab-pane
        label="检查信息(_business.studyData)"
        name="studyData"
      ></el-tab-pane>
      <el-tab-pane
        label="报告信息(_report.pageData)"
        name="pageData"
      ></el-tab-pane>
      <el-tab-pane
        label="当前控件属性(_report.currentComp)"
        name="curComp"
      ></el-tab-pane>
      <el-tab-pane
        label="编辑模式已绑定阈值的控件属性(_report.elements)"
        name="elementsAttr"
      ></el-tab-pane>
      <el-tab-pane
        label="脚本Demo"
        name="scriptStr"
      ></el-tab-pane>
    </el-tabs>
    <codemirror
      class="mirror"
      :value="code"
      :options="cmOptions"
    />
  </div>
</template>
<script>
import { studyData, pageData, curComp, scriptStr, elementsAttr } from './script-config'
import { codemirror } from 'vue-codemirror'
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/fold/foldcode.js');
require('codemirror/addon/fold/foldgutter.js');
require('codemirror/addon/fold/brace-fold.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/fold/indent-fold.js');
require('codemirror/addon/fold/markdown-fold.js');
require('codemirror/addon/fold/comment-fold.js');
import { mapGetters } from 'vuex'
export default {
  name: 'AttrScript',
  components: {
    codemirror
  },
  props: {
    busiStudyData: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      activeName: 'studyData',
      studyData: this.busiStudyData || studyData,
      pageData,
      curComp,
      elementsAttr,
      scriptStr,
      cmOptions: {
        readOnly: false,
        tabSize: 2,
        indentUnit: 2,
        mode: 'text/javascript',
        lineNumbers: true,
        line: true,
        smartIndent: true
      },
      code: this.busiStudyData || studyData
    }
  },
  computed: {
    ...mapGetters(['activeElement'])
  },
  watch: {
    'activeElement.propsValue' () {
      this.activeName = 'studyData'
      this.code = studyData
    },
    activeName (newValue) {
      this.code = this[newValue]
      if (newValue === 'curComp') {
        let eleProps = Object.keys(this.activeElement.propsValue)
        eleProps.forEach((propKey) => {
          this.code += `
          ${propKey} `
        })
        this.code += `
        }`
      }
    }
  }
}
</script>
<style lang="scss">
.attr-script {
  padding: 0 20px;
  .json-result {
    overflow: scroll;
    max-height: 200px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  .CodeMirror {
    height: 800px;
  }
}
</style>