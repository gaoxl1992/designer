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
      <div class="common-attr-style">
        <el-form>
          <el-form-item label="阈值">
            <el-autocomplete
              class="inline-input"
              size="small"
              v-model="activeElement.threshold"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="true"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="activeElement.hideOnPrint">打印隐藏</el-checkbox>
          </el-form-item>
          <el-form-item v-if="activeElement.threshold">
            <el-button
              size="small"
              @click="showDialog = true"
            >编辑事件</el-button>
          </el-form-item>
        </el-form>
        <baseAttr></baseAttr>
      </div>
    </div>
    <el-dialog :visible.sync="showDialog">
      <template slot="title">编辑事件 #{{ activeElement.threshold }}</template>
      <template>
        <codemirror
          class="mirror"
          ref="cmEditor"
          :value="code"
          :options="cmOptions"
          @input="onCmCodeChange"
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
  </div>
</template>

<script>
import BaseAttr from './attr-props-components/base-attr'
import PropsAttr from './attr-props-components/props-attr/index.vue'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import { mapState, mapGetters } from 'vuex'
import AreaTitle from '@/components/area-title'

export default {
  props: {},
  components: {
    BaseAttr,
    PropsAttr,
    codemirror,
    AreaTitle
  },
  data () {
    return {
      showDialog: false,
      code: '',
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true
      }
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters(['activeElementIndex', 'activeElement'])
  },
  mounted () {
    this.code = this.pageData.script
  },
  watch: {
    'activeElement.threshold' (val) {
      if (val) {
        this.activeElement.threshold = val.replace(/[^\w]/gi, '')
      }
    }
  },
  methods: {
    querySearch (queryString, cb) {
      let domains = []
      this.pageData.domainList.forEach((item) => {
        domains.push({
          value: item.option
        })
      });
      let results = queryString ? domains.filter(this.createFilter(queryString)) : domains;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter (queryString) {
      return (domains) => {
        return (domains.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    onCmCodeChange (newCode) {
      this.code = newCode
    },
    confirmDialog () {
      this.pageData.script = this.code
      this.showDialog = false
    },
    closeDialog () {
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss">
.components-attr-edit {
  height: 100%;
  .el-form-item {
    margin-bottom: 0;
  }
  .attr-title {
    font-weight: bold;
  }
  .common-attr-style {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-button--default {
      width: 100%;
    }
  }
  .attr-edit-inner {
    padding: 16px 20px;
    margin-bottom: 50px;
  }
  .attr-header {
    font-size: 14px;
    font-weight: 500;
    padding: 20px 20px 10px 20px;
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
  .mirror {
    margin-top: 20px;
  }
  .el-form-item__label {
    font-weight: 500;
    color: $font-color-base;
    font-size: 14px;
  }
}
</style>
