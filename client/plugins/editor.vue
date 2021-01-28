<template>
  <div :id="editorId + 'container'"
       class="rad-editor">
    <div class="title">{{ label }}</div>
    <!-- 设计和编辑模式 -->
    <div v-if="pagetype!=='preview'"
         class="rad-editor-inner"
         :class="'rad-editor-inner-' + pagetype"
         @click="showCharspop">
      <div class="special-icon"
           :style="{ bottom: editor + 40 + 'px' }"
           v-if="pagetype === 'editor' && showChars">
        <div class="flx">
          <div class="title">
            特殊符号<span class="tip">（双击应用）</span>
            <i class="el-icon-s-tools"
               @click.prevent="showEditDialog"></i>
          </div>
        </div>
        <ul class="charas">
          <el-tooltip effect="dark"
                      :content="char"
                      placement="top-start"
                      v-for="(char, index) in pageData.spCharacters"
                      :key="index">
            <li class="ellipsis"
                @dblclick="addHtml(char)">
              {{ char }}
            </li>
          </el-tooltip>
        </ul>
      </div>
      <textarea :id="editorId"
                :name="'content' + editorId"
                v-model="outContent"></textarea>
    </div>
    <!-- 只读模式 -->
    <div v-else
         class="preview-content"
         :style="defaultStyle"
         v-html="outContent"></div>

    <!-- 管理字符和词汇 -->
    <el-dialog title="管理字符和词汇"
               :visible.sync="showDialog"
               append-to-body
               modal-append-to-body
               :id="'wrapper-'+editorId">
      <div class="mng-chars">
        <div class="mng-chars-tip">每个选项单列一行</div>
        <el-input type="textarea"
                  class="mng-char-input"
                  v-model="mngCharStr"
                  resize="none"></el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="mini"
                   type="primary"
                   @click="confirmDialog">确认</el-button>
        <el-button size="mini"
                   @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import { mapState } from 'vuex'
import bus from '@/utils/bus'
export default {
  name: 'RadEditor',
  props: {
    content: {
      type: String,
      default: ''
    },
    editorId: {
      type: String,
      required: true
    },
    editor: {
      type: Number,
      default: 200
    },
    label: {
      type: String,
      default: ''
    },
    pagetype: String,
    element: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    editor () {
      this.initEditor()
    },
    inner (val) {
      this.$emit('update:value', val)
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData
    })
  },
  created () {
    if (this.pagetype === 'editor') {
      this.addClickFn()
    }
    this.outContent = (this.element && this.element.value) || ''
  },
  data () {
    return {
      defaultStyle: {
        'line-height': '1.2',
        'font-size': '14px'
      },
      reditor: null,
      outContent: this.content,
      items: [
        'fontname',
        '|',
        'fontsize',
        '|',
        'bold',
        'italic',
        'underline',
        'forecolor',
        'hilitecolor',
        '|',
        'justifyleft',
        'justifycenter',
        'justifyright',
        '|',
        'insertorderedlist',
        'lineheight',
        '|',
        'link',
        'unlink',
        '|',
        'table'
      ],
      inner: null,
      showChars: false,
      zIndex: null,
      doc: null,
      inEditor: false,
      showDialog: false,
      mngCharStr: ''
    }
  },
  methods: {
    showEditDialog () {
      this.showDialog = true
      this.mngCharStr = JSON.parse(
        JSON.stringify(this.pageData.spCharacters)
      ).join('\n')
    },
    handleLeave (event) {
      let editor = document.getElementById(this.editorId + 'container')
      let dialogs = document.getElementsByClassName('el-dialog__wrapper')
      let dialog = null
      for (let i = 0; i < dialogs.length; i++) {
        if (dialogs[i].id === 'wrapper-' + this.editorId) {
          dialog = dialogs[i]
        }
      }
      if (
        (editor &&
          !editor.contains(event.target)) &&
        (dialog && !dialog.contains(event.target)) &&
        !this.inEditor
      ) {
        setTimeout(() => {
          this.doc.style.zIndex = this.zIndex
          this.showChars = false
        }, 50)
      }
    },
    closeDialog () {
      let old = JSON.parse(JSON.stringify(this.pageData.spCharacters))
      if (old.join('\n') !== this.mngCharStr) {
        this.$alert('您有未保存的修改，是否保存?', '提示', {
          showCancelButton: true,
          confirmButtonText: '保存并关闭',
          cancelButtonText: '关闭'
        }).then((action) => {
          if (action === 'confirm') {
            let arr = this.mngCharStr.split('\n')
            for (let i = arr.length; i--; i >= 0) {
              if (!arr[i]) {
                arr.splice(i, 1)
              }
            }
            this.pageData.spCharacters = JSON.parse(JSON.stringify(arr))
            bus.$emit('updateSpChars', this.pageData.spCharacters)
          }
          this.showDialog = false
        })
      } else {
        this.showDialog = false
      }
    },
    confirmDialog () {
      let arr = this.mngCharStr.split('\n')
      for (let i = arr.length; i--; i >= 0) {
        if (!arr[i]) {
          arr.splice(i, 1)
        }
      }
      this.pageData.spCharacters = JSON.parse(JSON.stringify(arr))
      bus.$emit('updateSpChars', this.pageData.spCharacters)
      this.showDialog = false
    },
    addClickFn () {
      document.addEventListener('click', this.handleLeave, false)
    },
    addHtml (char) {
      this.reditor.appendHtml(char)
    },
    removeEditor () {
      if (this.reditor) {
        this.reditor.remove()
        let ins = window.KindEditor.instances
        for (let i = ins.length - 1; i >= 0; i--) {
          if (!ins[i].isCreated) {
            ins.splice(i, 1)
          }
        }
      }
    },
    initEditor () {
      let _this = this
      _this.removeEditor()
      _this.reditor = window.KindEditor.create(
        `textarea[name='content${this.editorId}']`,
        {
          width: '100%',
          height: `${this.editor}px`,
          minHeight: this.editor,
          minWidth: '100%',
          items: _this.items,
          resizeType: 0,
          filterMode: false,
          themeType: this.editorId,
          afterFocus: () => {
            if (this.pagetype === 'editor') {
              this.inEditor = true
              this.showCharspop()
            }
          },
          afterBlur: () => {
            let iframe = this.reditor.edit.iframe[0].contentWindow
            let innerHeight = iframe.document.getElementsByClassName(
              'ke-content'
            )[0].offsetHeight
            if (this.element) {
              this.element.innerHeight = innerHeight
            }

            this.inEditor = false
          },
          afterChange: () => {
            this.innerChange()
          }
        }
      )
      if (_this.reditor) {
        if (this.element && this.element.value) {
          _this.reditor.fullHtml(this.element.value)
        }
        _this.reditor.readonly(this.pagetype !== 'editor')
        // 有阈值的富文本挂载到widnow上 供外部读写
        if (this.pagetype === 'editor') {
          window.reditor = window.reditor || {}
          if (this.element && this.element.threshold) {
            window.reditor[this.element.threshold] = _this.reditor
          }
        }
      }
    },
    showCharspop () {
      if (this.pagetype !== 'editor') {
        return
      }
      this.doc =
        this.doc ||
        document.getElementsByClassName(
          'rad-element-wrapper-' + this.editorId
        )[0]
      if (this.zIndex !== null) {
        this.zIndex = this.doc.style.zIndex
      }
      this.doc.style.zIndex = 999
      this.showChars = true
    },
    innerChange () {
      if (this.reditor) {
        this.inner = this.reditor.fullHtml()
      }
    }
  },
  mounted () {
    this.doc = document.getElementsByClassName(
      'rad-element-wrapper-' + this.editorId
    )[0]

    // 初始访问时创建
    if (this.pagetype !== 'preview') {
      this.initEditor()
    }
  },
  activated () {
    // keep-alive 进入时创建
    this.doc = document.getElementsByClassName(
      'rad-element-wrapper-' + this.editorId
    )[0]

    // 初始访问时创建
    if (this.pagetype !== 'preview') {
      this.initEditor()
    }
  },
  deactivated () {
    // keep-alive 离开时移除
    this.removeEditor()
    document.removeEventListener('click', this.handleLeave, false)
    if (this.element && this.element.threshold && window.reditor[this.element.threshold]) {
      delete window.reditor[this.element.threshold]
    }
  },
  beforeDestroy () {
    this.removeEditor()
    document.removeEventListener('click', this.handleLeave, false)
    if (this.element && this.element.threshold && window.reditor[this.element.threshold]) {
      delete window.reditor[this.element.threshold]
    }
  }
}
</script>
<style lang="scss">
.rad-editor {
  .rad-editor-inner {
    position: relative;
  }
  .title {
    padding: 2px;
  }
  .ke-container {
    background-color: transparent;
  }
  .special-icon {
    position: absolute;
    right: 0;
    max-width: 76%;
    max-height: 252px;
    font-size: 13px;
    color: #131313;
    background: #e4e7ee;
    box-shadow: 0px -2px 4px 0px #c8ced4;
    padding: 4px;
  }
  .ke-toolbar,
  .ke-statusbar {
    background-color: transparent;
    border-bottom: 1px solid #adb1b8;
  }
  .ke-statusbar {
    border-top: 1px solid #adb1b8;
  }
  .ke-container {
    border-color: #adb1b8;
  }
  .ke-toolbar .ke-outline {
    border: none;
  }
  .charas {
    display: flex;
    flex-wrap: wrap;
    li {
      margin-right: 12px;
      width: 70px;
      height: 30px;
      padding: 4px;
      line-height: 21px;
      border-radius: 1px;
      border: 1px solid #cbced4;
      font-weight: 400;
      color: #161616;
      margin-top: 5px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: keep-all;
      &:hover {
        background: #b8cde2;
        border-color: #cbced4;
      }
    }
  }
  .rad-editor-inner-preview {
    .ke-toolbar,
    .ke-statusbar {
      display: none !important;
    }
    .ke-container {
      border: none !important;
    }
  }

  .el-icon-s-tools {
    padding-left: 10px;
    color: #434343;
  }
  .el-icon-close {
    margin-right: 10px;
  }
  .flx {
    display: flex;
    justify-content: space-between;
    line-height: 13px;
    .title {
      font-weight: 500;
      color: #161616;
      font-size: 14px;
    }
    .tip {
      font-weight: 400;
      color: #707070;
      font-size: 13px;
    }
  }
}
.preview-content {
  font-size: 14px;
}
.mng-chars {
  .mng-chars-tip {
    font-weight: 400;
    color: #707070;
    line-height: 22px;
    font-size: 14px;
  }
  .mng-char-input {
    white-space: pre-wrap;
    .el-textarea__inner {
      height: 346px;
      overflow: auto;
    }
  }
}
</style>