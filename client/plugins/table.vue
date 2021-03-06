<template>
  <div class="rad-table">
    <!-- 设计页和编辑页未选择模版状态  -->
    <div
      class="rad-table-inner print-hidden"
      v-if="pagetype === 'designer'"
    >
      <div class="table-placeholder">
        <i class="el-icon-menu"></i>
        <div class="table-placeholder-text">
          表格占位符
        </div>
      </div>
    </div>
    <div
      @click="selectTableModel"
      class="rad-table-inner print-hidden"
      v-if="pagetype === 'editor' && (!activeTpl || !activeTpl.id)"
    >
      <div class="table-placeholder">
        <i class="el-icon-menu"></i>
        <div class="table-placeholder-text">点击选择表格模版</div>
      </div>
    </div>
    <div
      v-if="pagetype !== 'preview' && activeTpl && activeTpl.id"
      class="choose-tip print-hidden"
      @click="selectTableModel"
    ><i class="el-icon-s-grid"></i>重新选择模版</div>
    <div
      class="table-container"
      :id="editorId + 'container'"
      v-if="activeTpl && activeTpl.id"
      v-html="activeTpl.tpl"
      @change="changeInner"
      @click="bindUrFather"
    >
    </div>
    <!-- 选择表格模板 -->
    <el-dialog
      title="选择表格模板"
      :visible.sync="showTableModel"
      append-to-body
      modal-append-to-body
    >
      <ul
        class="table-model-list"
        v-if="tableList && tableList.length"
      >
        <template v-for="(item, index) in tableList">
          <li
            class="table-model-item"
            :key="index"
          >
            <i class="el-icon-document"></i>{{ item.title }}
            <el-button
              class="apply-btn"
              size="mini"
              type="primary"
              @click="applyTemplate(item, index)"
            >{{ activeTpl && item.id === activeTpl.id ? '取消应用' : '应用' }}</el-button>
          </li>
        </template>
      </ul>
      <span v-else>暂无表格模板，请先创建</span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { createUUID } from '@/utils/mUtils'
import bus from '@/utils/bus'
export default {
  name: 'RadTable',
  props: {
    table: String,
    pagetype: String,
    editorId: {
      type: String,
      required: true
    },
    element: {
      type: Object,
      default: () => {}
    }
  },
  inject: ['modelId'],
  computed: {
    ...mapState({
      tableTpl () {
        let state = this.$store1.state[this.modelId]
        return state?.tableTpl || []
      }
    }),
    activeElement () {
      return this.$store1.getters[this.modelId + '/activeElement']
    }
  },
  data () {
    return {
      showTableModel: false,
      tableList: () => [],
      activeTpl: null,
      lastEvent: null,
      hasMatchTpl: false
    }
  },
  mounted () {
    this.tableList = this.tableTpl
    this.activeTpl = (this.element && this.element.value) || null

    bus.$on('applyTableTplDetail', (template) => {
      this.doApplyTableContent(template)
    })

    window.addEventListener('keydown', this.inputDown, false)
  },
  methods: {
    doApplyTableContent (template) {
      let content = template.content.match(/<table[\s\S]*?<\/table>/g)?.[0] || ''

      let tpl = {
        id: template.id,
        name: template.title,
        tpl: content,
        departmentId: template.departmentId
      }
      this.activeTpl = tpl
      this.$emit('update:value', tpl)
    },
    inputDown (el) {
      console.log('------', el)
    },
    selectTableModel () {
      if (this.pagetype === 'editor') {
        this.showTableModel = true
      }
    },
    applyTemplate (template) {
      if (
        this.activeTpl &&
        this.activeTpl.id &&
        this.activeTpl.id === template.id
      ) {
        this.activeTpl = null
        this.$emit('update:value', null)
      } else {
        bus.$emit('applyTableTpl', template.id)
      }
      this.showTableModel = false
    },
    /*
     * 编辑后修改当前单元格为span标签
     */
    changeInner (event) {
      let target = null
      if (event && event.target) {
        target = event.target
      } else {
        target = event
      }
      let parentNode = target.parentNode
      if (target.localName === 'span' || parentNode.localName === 'span') {
        return
      }
      if (target.localName === 'select' || parentNode.localName === 'select') {
        let selVal = target.value
        let options = document.getElementById(target.id).getElementsByTagName('option')
        for (let i = 0; i < target.options.length; i++){  
          target.options[i].selected = (target.options[i].value === selVal ? 'selected' : false);
          if (options[i].innerHTML !== selVal) {
            options[i].outerHTML = options[i].outerHTML.replaceAll(/selected="selected"/, '')
          } else {
            options[i].outerHTML = options[i].outerHTML.replaceAll(/<option /, '<option selected=\"selected\" ')
          }
        }
        return
      }
      // 创建新的span标签用来展示
      let spanEle = document.createElement('span')
      spanEle.innerHTML = target.value
      spanEle.id = target.id
      // 替换input为span标签
      if (!target.style) {
        target.style = {}
      }
      target.style.display = 'none'
      if (target.id) {
        target.removeAttribute('id')
      }
      let spanIndex = 1
      for (let i = 0; i < parentNode.childNodes.length; i++) {
        if (parentNode.childNodes[i].localName && parentNode.childNodes[i].localName === 'input') {
          spanIndex = i + 1
          break
        }
      }
      if (spanIndex === parentNode.childNodes.length) {
        parentNode.appendChild(spanEle)
      } else {
        parentNode.insertBefore(spanEle, parentNode.childNodes[spanIndex]) 
      }

      this.lastEvent = null
      this.activeTpl.tpl = document.getElementById(
        this.editorId + 'container'
      ).innerHTML
      this.$emit('update:value', this.activeTpl)
    },
    /*
     * 绑定所点击元素的父元素
     */
    bindUrFather (event) {
      // 预览模式不转换
      if (this.pagetype === 'preview') {
        return
      }

      let t = event.target
      // 如果点击的是下拉框或者输入框，赋予唯一的id
      if ((t.localName === 'input') && !t.id) {
        t.id = createUUID()
      }

      // 下拉选项不做处理
      if (t.localName === 'option') {
        return
      }
      // 非空单元格不做处理
      if ((t.localName === 'td' && t.innerHTML !== '&nbsp;' && (t.childNodes.length === 0 || (t.childNodes[0] && !t.childNodes[0].localName))) || t.localName === 'select') {
        return
      }

      // 如果上一次事件没有闭环
      if (this.lastEvent && this.lastEvent !== event.target) {
        this.changeInner(this.lastEvent)
      }

      if (t.localName === 'td' && t.innerHTML !== '&nbsp;') {
        let childs = t.childNodes
        let hasInput = false
        for (let i = 0; i < childs.length; i++) {
          if (childs[i].localName === 'input') {
            hasInput = true
          }
        }
        if (!hasInput) {
          return
        }
      }

      //  点击单元格且内容为空
      if (t.localName === 'td' && t.innerHTML === '&nbsp;') {
        t.innerHTML = `<input class="table-input" id="${createUUID()}">`
        return
      }

      let parent = t
      if (t.id) {
        parent = t.parentNode
      }

      let childs = parent.childNodes
      // 输入框和span组合
      let inputIndex = 0
      if (childs.length > 1) {
        for (let i = 0; i < childs.length; i++) {
          if (childs[i].localName === 'input') {
            inputIndex = i
            break
          }
        }
        if (!childs[inputIndex].style) {
          childs[inputIndex].style = {}
        }
        childs[inputIndex].style.display = 'inline-block'
        let max = inputIndex + 1
        if (childs[max].localName && childs[max].localName === 'span' && childs[max].id) {
          childs[inputIndex].value = childs[max].innerHTML
          parent.removeChild(childs[max])
        }
      }
      this.lastEvent = childs[inputIndex]
    }
  }
}
</script>
<style lang="scss">
.rad-table {
  height: 100%;
  width: 100%;
  td {
    span {
      word-break: break-all;
      padding: 5px;
    }
    textarea {
      max-height: 80%;
    }
  }
  .rad-table-inner {
    border: 1px solid #adb1b8;
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-weight: 400;
    color: #000;
    text-align: center;
    .table-placeholder {
      position: absolute;
      top: calc(50% - 28px);
      left: calc(50% - 80px);
      vertical-align: baseline;
      display: inline-block;
    }
  }
  .choose-tip {
    font-size: 12px;
    position: absolute;
    top: -20px;
    left: 3px;
    color: $primary;
  }
}
.table-model-item {
  .el-icon-document {
    padding-right: 16px;
    color: $primary;
  }
  &::after {
    display: block;
    height: 1px;
    width: 100%;
    margin: 15px 0;
    content: '';
    background-color: #dcdfe6;
  }
  .apply-btn {
    float: right;
  }
}
.table-container {
  table {
    table-layout: fixed;
  }
  td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .table-input {
    border: none;
    outline: none;
    text-align: -webkit-match-parent;
    font-size: inherit;
    // width: 100%;
    background: transparent;
    &:hover {
      border: none;
      outline: none;
    }
    &:active {
      border: none;
      outline: none;
    }
    &:focus {
      border: none;
      outline: none;
      text-align: -webkit-match-parent;
    }
  }
}
</style>
