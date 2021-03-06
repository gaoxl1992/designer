<template>
  <div
    :id="editorId + 'container'"
    class="rad-editor"
  >
    <div class="title">{{ label }}</div>
    <!-- 设计和编辑模式 -->
    <div
      v-if="pagetype !== 'preview'"
      class="rad-editor-inner"
      :class="'rad-editor-inner-' + pagetype"
      @click="showCharspop"
    >
      <i
        class="icon iconfont iconmore"
        @click="showCharspopAgain"
      ></i>
      <div
        class="special-icon"
        :style="{ bottom: iconBottom }"
        v-if="pagetype === 'editor' && showChars"
      >
        <div class="flx">
          <div class="title">
            特殊符号
            <span class="tip">（双击应用）</span>
          </div>
          <span>
            <i
              class="icon iconfont iconset_fill"
              @click.prevent="showEditDialog"
            ></i>
            <i
              class="icon iconfont iconclose"
              @click="closeSp"
            ></i>
          </span>
        </div>
        <el-row
          class="charas"
          justify="start"
        >
          <el-col
            :xs="8"
            :sm="6"
            :md="4"
            :lg="3"
            v-for="(char, index) in pageData.spCharacters"
            :key="index"
          >
            <el-tooltip
              effect="dark"
              :content="char"
              placement="top-start"
              :open-delay="200"
            >
              <span
                class="char ellipsis"
                @dblclick="addHtml(char)"
              >{{ char }}</span>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <textarea
        :id="editorId"
        :name="'content' + editorId"
        v-model="outContent"
      ></textarea>
    </div>
    <!-- 只读模式 -->
    <div
      v-else
      class="preview-content"
      :style="cssData"
      v-html="outContent"
    ></div>

    <!-- 管理字符和词汇 -->
    <el-dialog
      title="管理字符和词汇"
      :visible.sync="showDialog"
      append-to-body
      :modal-append-to-body="true"
      :id="'wrapper-' + editorId"
      :before-close="closeDialog"
    >
      <div class="mng-chars">
        <div class="mng-chars-tip">每个选项单列一行</div>
        <el-input
          type="textarea"
          class="mng-char-input"
          v-model="mngCharStr"
          resize="none"
        ></el-input>
      </div>
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
      :show-close="false"
      custom-class="select-dialog"
      :visible.sync="selectDialogShow"
      :modal="false"
      :close-on-click-modal="true"
      append-to-body
      destroy-on-close
    >
      <el-radio-group v-model="selectedOption">
        <template v-for="(item, index) in options">
          <el-radio :key="index" :label="index" :id="'radio' + index" @change="confirm">
            <el-input v-model="item.outerText" size="mini" @change="changeText($event, index)"></el-input>
          </el-radio>
        </template>
      </el-radio-group>
      <!-- <el-button size="mini" type="primary" plain @click="confirm">确定</el-button>
      <el-button size="mini" plain @click="cancel">取消</el-button> -->
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
    },
    fontStyle: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#000000'
    },
    fontWeight: {
      type: Number,
      default: 500
    },
    fontSize: {
      type: Number,
      default: 14
    },
    fontFamily: {
      type: String,
      default: 'Microsoft YaHei'
    },
    focusEditorId: {
      type: String,
      default: ''
    },
    compId: {
      type: String,
      default: ''
    }
  },
  watch: {
    isInput (val, oldVal) {
      if (oldVal && !val) {
        let dom = this.reditor.edit.iframe[0].contentWindow.document.getElementById(this.inputId)
        let controlinfo = JSON.parse(dom.dataset.controlinfo)
        controlinfo.default = dom.value
        dom.dataset.controlinfo = JSON.stringify(controlinfo)
        dom.setAttribute('value', dom.value);
      }
    },
    focusEditorId (val) {
      if (!val) {
        return
      }
      this.showChars = val === this.editorId
      if (this.showChars) {
        this.reditor.focus()
      } else {
        this.reditor.blur()
      }
    },
    editor () {
      if (this.pagetype === 'designer') {
        this.initEditor()
      }
    },
    inner (val) {
      this.$emit('update:value', val)
    },
    fontStyle (val) {
      this.cssData['font-style'] = val
      this.initEditor()
    },
    color (val) {
      this.cssData['color'] = val
      this.initEditor()
    },
    fontWeight (val) {
      this.cssData['font-weight'] = val
      this.initEditor()
    },
    fontSize (val) {
      this.cssData['font-size'] = val
      this.initEditor()
    },
    fontFamily (val) {
      this.cssData['font-family'] = val
      this.initEditor()
    }
  },
  inject: ['modelId'],
  computed: {
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
      }
    }),
    iconBottom () {
      let rd = this.element?.rd || 1
      return this.editor / rd + 25 + 'px'
    }
  },
  created () {
    if (this.pagetype === 'editor') {
      this.addClickFn()
    }
    this.outContent = (this.element && this.element.value) || ''
  },
  data () {
    return {
      reditor: null,
      outContent: this.content,
      items: [
        'fontname', 'fontsize', '|',
        'bold', 'italic', 'underline', 'forecolor', 'hilitecolor', '|',
        'justifyleft', 'justifycenter', 'justifyright', '|',
        'insertorderedlist', 'lineheight', '|',
        'undo', 'redo', '|',
        'cut', 'copy', '|',
        'fullscreen'
      ],
      inner: null,
      showChars: false,
      zIndex: null,
      doc: null,
      inEditor: false,
      showDialog: false,
      mngCharStr: '',
      cssData: {
        'font-style': this.fontStyle,
        'font-family': this.fontFamily,
        'font-weight': this.fontWeight,
        'font-size': this.fontSize + 'px',
        'color': this.color
      },
      formCssData: {
        'font-size': 'inherit',
        'font-family': 'inherit',
        'color': 'inherit !important',
        'background-color': 'transparent !important',
        'font-weight': 'inherit',
        'font-style': 'inherit',
        'box-shadow': 'none !important',
        'display': 'none !important'
      },
      selectDialogShow: false,
      options: [],
      selectedOption: 0,
      backOptions: [],
      curId: '',
      isInput: false,
      inputId: '',
      fullscreenMode: false
    }
  },
  methods: {
    closeSp () {
      this.doc.style.zIndex = this.zIndex
      this.showChars = false
      this.$emit('focusEditor', '')
      window.hiddenChars = true
    },
    showCharspopAgain () {
      window.hiddenChars = false
      this.showCharspop()
    },
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
      if ((editor &&!editor.contains(event.target)) && (dialog && !dialog.contains(event.target))) {
        if (this?.doc?.style) {
          this.doc.style.zIndex = this.zIndex
        }
        this.showChars = false
        this.$emit('focusEditor', '')
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
          this.selectDialogShow = false
          this.showCharspop()
        }).catch(() => {
          this.showDialog = false // FIX-BUG:5762
          this.selectDialogShow = false
          this.showCharspop()
        });
      } else {
        this.showDialog = false
        this.selectDialogShow = false
        this.showCharspop()
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
      this.reditor.insertHtml(char)
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
    cancel () {
      this.selectDialogShow = false
      this.options = JSON.parse(JSON.stringify(this.backOptions))
      this.backOptions = []
    },
    changeText (value, index) {
      this.options[index].outerText = value
      if (this.selectedOption === index) {
        this.confirm()
      }
    },
    confirm () {
      window.removeEventListener('keydown', this.confirm);
      let iframe = this.reditor.edit.iframe[0].contentWindow.document
      let sel = null
      let sels = iframe.getElementsByTagName('select');
      if (sels ?. length) {
        for (let i = 0; i < sels.length; i++) {
          if (sels[i].id === this.curId) {
            sel = sels[i];
          }
        }
      }
      let controlinfo = JSON.parse(sel.dataset.controlinfo)
      for (let i = 0; i < sel.options.length; i++) {
        sel.options[i].innerHTML = this.options[i].outerText
        sel.options[i].innerText = this.options[i].outerText
        sel.options[i].value = this.options[i].outerText
        controlinfo.options[i] = {
          value: this.options[i].outerText,
          defaultFlag: i === this.selectedOption ? 1 : false
        }
        if (i === this.selectedOption) {
          sel.getElementsByTagName('option')[i].setAttribute('selected', 'selected');
        } else {
          sel.getElementsByTagName('option')[i].removeAttribute('selected')
        }
      }
      controlinfo.default =  this.options[this.selectedOption].outerText
      sel.value = this.options[this.selectedOption].outerText
      sel.dataset.controlinfo = JSON.stringify(controlinfo)
      iframe.getElementById(this.curId).innerText = this.options[this.selectedOption].outerText
      this.selectDialogShow = false
      this.options = []
      this.backOptions = []

      this.innerChange()
    },
    initEditor () {
      let _this = this
      _this.removeEditor()
      let inputCssData = {
        'width': '80px',
        'display': 'inline-block',
        ..._this.formCssData
      }
      let cssData = (`
        body${JSON.stringify(_this.cssData)}
        .ke-content input${JSON.stringify(inputCssData)}
        .ke-content select${JSON.stringify(_this.formCssData)}
        .ke-content option {display:none}
        .ke-content input:hover {cursor:pointer}
        .ke-content option:hover {cursor:pointer}
        .ke-content select:hover {cursor:pointer;}
        .ke-content .aspan {color:#0A68B3;cursor:pointer;text-decoration:underline;}
        `).replace(/,/g, ';').replace(/"/g, '')
      let rd = this.element?.rd || 1
      _this.reditor = window.KindEditor.create(
        `textarea[name='content${this.editorId}']`,
        {
          width: '100%',
          height: this.editor / rd,
          minHeight: this.editor / rd,
          minWidth: '100%',
          items: _this.items,
          resizeType: 0,
          filterMode: false,
          themeType: this.editorId,
          cssData: cssData,
          afterFocus: () => {
            let iframe = this.reditor.edit.iframe[0].contentWindow
            iframe.addEventListener('paste', this.handlePaste, false)
            iframe.addEventListener('keydown', (e) => {
              const keyCode = e.keyCode;
              if (keyCode === 122) {
                e.preventDefault();
                _this.fullscreenMode = !_this.fullscreenMode;
                _this.reditor.fullscreen(_this.fullscreenMode);
              }
            })
            iframe.addEventListener('click', (el) => {
              this.selectDialogShow = false
              if (el.target.classList && el.target.classList[0] === 'aspan') {
                el.target.addEventListener('mouseleave', (ele) => {
                  let newText = ele.target.innerText
                  let sels = iframe.document.getElementsByTagName('select');
                  let sel = null
                  if (sels ?. length) {
                    for (let i = 0; i < sels.length; i++) {
                      if (sels[i].id === el.target.id) {
                        sel = sels[i];
                      }
                    }
                  }
                  let controlinfo = JSON.parse(sel.dataset.controlinfo)
                  let seletedIndex = 0
                  for (let i = 0; i < sel.options.length; i++) {
                    if (sel.options[i].selected) {
                      seletedIndex = i
                    }
                  }
                  sel.options[seletedIndex].innerHTML = newText
                  sel.options[seletedIndex].innerText = newText
                  sel.options[seletedIndex].value = newText
                  controlinfo.options[seletedIndex].value = newText
                  sel.dataset.controlinfo = JSON.stringify(controlinfo)
                  el.target.removeEventListener('mouseleave', function (event) {
                    event.preventDefault()
                  }, false)
                })
              } else {
                this.showCharspop()
              }
            })
            // 鼠标右键选择框
            iframe.addEventListener('contextmenu', (el) => {
              el.preventDefault();
              if (el.target.classList && el.target.classList[0] === 'aspan') {
                window.removeEventListener('keydown', this.confirm);
                let sels = iframe.document.getElementsByTagName('select');
                let targetSel = null;
                if (sels ?. length) {
                  for (let i = 0; i < sels.length; i++) {
                    if (sels[i].id === el.target.id) {
                      targetSel = sels[i];
                    }
                  }
                }
                this.curId = el.target.id
                this.options = []
                let options = targetSel.options
                for (let i = 0; i < options.length; i++) {
                  this.options.push({
                    selected: options[i].selected,
                    outerText: options[i].outerText
                  });
                  if (options[i].selected) {
                    this.selectedOption = i
                  }
                }
                this.backOptions = JSON.parse(JSON.stringify(this.options))
                this.selectDialogShow = true
                this.showChars = false
                this.isInput = false
                this.calDialogPosi(el);

                this.$nextTick(() => {
                  let sel = document.getElementById('radio' + this.selectedOption)
                  if (sel) {
                    sel.focus();
                  }
                });

                window.addEventListener('keydown', this.confirm, false);
              } else if (el.target.localName && el.target.localName === 'input') {
                this.isInput = false
                this.curId = el.target.id
                this.isInput = true
                this.inputId = el.target.id
              } else {
                this.selectDialogShow = false
                this.curId = ''
                this.isInput = false
                if (this.pagetype === 'editor') {
                  this.inEditor = true
                  if (this.element && this.element.threshold) {
                    window[this.modelId].focusedEditor = this.element.threshold
                  }
                  if (window?.[this.modelId]?.report?.currentComp) {
                    window[this.modelId].report.currentComp = this.element
                  }
                }
              }
            });
          },
          afterBlur: () => {
            let iframe = this.reditor.edit.iframe[0].contentWindow
            let innerHeight = iframe.document?.getElementsByClassName(
              'ke-content'
            )?.[0]?.offsetHeight
            if (this.element) {
              this.element.innerHeight = innerHeight
            }
            this.innerChange()
            this.isInput = false
            this.inEditor = false
          },
          afterChange: () => {
            this.innerChange()
          }
        }
      )
      if (_this.reditor) {
        if (this.pagetype === 'designer') {
          _this.reditor.html('默认样式')
        }
        _this.reditor.readonly(this.pagetype !== 'editor')
        // 有阈值的富文本挂载到widnow上 供外部读写
        if (this.pagetype === 'editor') {
          let keEdit = document.getElementsByClassName('ke-container-' + this.editorId)[0].getElementsByClassName('ke-edit')[0];
          keEdit.style.height = `${this.editor / rd}px`
          keEdit.getElementsByClassName('ke-edit-iframe')[0].style.height = `${this.editor / rd}px`
          this.element.propsValue.editor = this.editor / rd
          window[this.modelId] = window[this.modelId] || {}
          window[this.modelId].reditor = window[this.modelId].reditor || {}
          if (this.element && this.element.threshold) {
            window[this.modelId].reditor[this.element.threshold] = {
              edit: _this.reditor,
              label: this.label
            }
          }
        }
      }
    },
    calDialogPosi (el) {
      let dom = document.getElementsByClassName('rad-element-wrapper-' + this.editorId)[0]
      let clientHeight = dom.getElementsByClassName('title')[0].clientHeight
      let selectDialogs = document.getElementsByClassName('select-dialog')
      let scrollTop = document.getElementById('scale_' + this.modelId.split('_')[1]).scrollTop
      let edtorScrollTop = dom.getElementsByTagName('iframe')[0].contentDocument.getElementsByClassName('ke-content')[0].scrollTop
      if (selectDialogs?.length) {
        for (let i = 0 ; i < selectDialogs.length; i++) {
          selectDialogs[i].parentNode.style.top = this.getOffsetTop(dom) - scrollTop + clientHeight + el.target.offsetTop + 50 - edtorScrollTop + 'px'
          selectDialogs[i].parentNode.style.left = this.getOffsetLeft(dom) + el.target.offsetLeft + 'px'
          selectDialogs[i].parentNode.style.width = '250px'
          selectDialogs[i].parentNode.style.maxHeight = '500px'
          selectDialogs[i].style.top = 0
          selectDialogs[i].style.left = 0
          selectDialogs[i].style.marginTop = '0 !important'
        }
      }
    },
    handlePaste (event) {
      if (event.clipboardData || event.originalEvent) {
        let clipboardData = (event.clipboardData || window.clipboardData)
        let val = clipboardData.getData('text')
        this.reditor.insertHtml(val)
        event.preventDefault()
        document.removeEventListener('paste', this.handlePaste);
      }
    },
    getOffsetTop (obj) {
      let tmp = obj.offsetTop
      let val = obj.offsetParent
      while (val != null) {
        tmp += val.offsetTop
        val = val.offsetParent
      }
      return tmp
    },
    getOffsetLeft (obj) {
      let tmp = obj.offsetLeft
      let val = obj.offsetParent
      while (val != null) {
        tmp += val.offsetLeft
        val = val.offsetParent
      }
      return tmp
    },
    showCharspop () {
      if (this.pagetype !== 'editor' || window.hiddenChars) {
        return
      }
      this.doc = this.doc || document.getElementsByClassName(
          'rad-element-wrapper-' + this.editorId
        )[0]
      if (this.zIndex !== null) {
        this.zIndex = this.doc.style.zIndex
      }
      this.doc.style.zIndex = 999
      this.showChars = true
      this.$emit('focusEditor', this.editorId)
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
    if (this.element && this.element.threshold && window?.[this.modelId]?.reditor?.[this.element.threshold]) {
      // delete window.reditor[this.modelId][this.element.threshold]
      delete window[this.modelId].focusedEditor
    }
    window.hiddenChars = false
  },
  beforeDestroy () {
    this.removeEditor()
    document.removeEventListener('click', this.handleLeave, false)
    if (this.element && this.element.threshold && window?.[this.modelId]?.reditor?.[this.element.threshold]) {
      // delete window.reditor[this.modelId][this.element.threshold]
      delete window[this.modelId].focusedEditor
    }
    window.hiddenChars = false
  }
}
</script>
<style lang="scss">
.ke-content {
  &:focus {
    outline: none !important;
  }
}
.rad-editor {
  .iconfont {
    &:hover {
      color: $primary;
    }
  }
  .rad-editor-inner {
    position: relative;
    .iconmore {
      right: 10px;
      top: 2.5px;
      position: absolute;
    }
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
    min-width: 280px;
    min-height: 28px;
    font-size: 13px;
    color: #131313;
    background: $page-bg-color;
    padding: 10px;
    border: 1px solid #c6c9cf;
    border-radius: 4px;
    background-color: #e4e7ee;
    box-shadow: 0 2px 12px 0 #c8ced4;
  }
  .ke-toolbar {
    background-color: transparent;
    border-bottom: 1px solid #adb1b8;
  }
  .ke-statusbar {
    display: none;
  }
  .ke-container {
    border-color: #adb1b8;
  }
  .ke-toolbar .ke-outline {
    border: none;
  }
  .charas {
    max-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    .char {
      margin-right: 12px;
      width: calc(100% - 10px);
      height: 30px;
      padding: 4px;
      line-height: 21px;
      border-radius: 1px;
      border: 1px solid $border-color;
      font-weight: 400;
      color: $font-color-base;
      margin-top: 5px;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: keep-all;
      display: inline-block;
      &:hover {
        background: #b8cde2;
        border-color: $border-color;
      }
    }
    .el-col {
      min-width: 70px;
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

  .flx {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .title {
      font-weight: 500;
      color: $font-color-base;
      font-size: 14px;
    }
    .tip {
      font-weight: 400;
      color: #707070;
      font-size: 13px;
    }
    .iconclose, .iconset_fill {
      color: #434343;
      font-size: 14px;
    }
    .iconset_fill {
      padding-left: 10px;
      padding-right: 10px;
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
.theme-light .select-dialog {
  position: absolute;
  width: 250px !important;
  max-height: 500px;
  overflow-y: auto !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  .el-radio-group {
    margin-bottom: 10px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 10px;
  }
  .el-input {
    width: 200px;
  }
  .el-button {
    float: right;
    margin-left: 10px;
    margin-bottom: 10px;
  }
}
</style>
