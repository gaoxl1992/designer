<!--
 * @Description: 脚本指南弹出层内容
-->
<template>
  <div class="attr-script">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="检查信息(_business.studyData)"
        name="1"
      >
        <pre
          class="json-result"
          v-html="stydyData"
        ></pre>
      </el-collapse-item>
      <el-collapse-item
        title="报告信息(_report.pageData)"
        name="2"
      >
        <pre
          class="json-result"
          v-html="pageData"
        ></pre>
      </el-collapse-item>
      <el-collapse-item
        title="当前控件属性(_report.currentComp)"
        name="3"
      >
        <pre
          class="json-result"
          v-html="curComp"
        ></pre>
      </el-collapse-item>
      <el-collapse-item
        title="编辑模式已绑定阈值的控件属性(_report.elements)"
        name="4"
      >
        <pre
          class="json-result"
          v-html="elementsAttr"
        ></pre>
      </el-collapse-item>
      <el-collapse-item
        title="不同组件可访问(_report.currentComp)"
        name="3"
      >
        <pre
          class="json-result"
          v-html="curComp"
        ></pre>
      </el-collapse-item>
      <el-collapse-item
        title="脚本Demo"
        name="5"
      >
        <pre
          class="json-result"
          v-html="scriptStr"
        ></pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { stydyData, pageData, curComp, scriptStr, elementsAttr } from './index'
export default {
  name: 'AttrScript',
  data () {
    return {
      activeNames: ['1'],
      stydyData,
      pageData,
      curComp,
      elementsAttr,
      scriptStr
    }
  },
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
}
</style>