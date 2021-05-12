<template>
  <div class="edit-wrapper">
    <div class="editor-main">
      <EngineH5Swiper
        :pageData="pageData"
        pagetype="editor"
      >
      </EngineH5Swiper>
    </div>
    <!--预览 用于生成html-->
    <EngineH5Swiper
      id="header"
      :nopb="true"
      style="display: none"
      v-if="showPreview"
      @closePreview="showPreview = false"
      :pageData="pageHeaderTpl"
      pagetype="preview"
    >
    </EngineH5Swiper>
    <EngineH5Swiper
      id="body"
      :nopt="pageData.fixedHeader.openFixed ? true : false"
      :nopb="pageData.fixedFooter.openFixed ? true : false"
      style="display: none"
      v-if="showPreview"
      @closePreview="showPreview = false"
      :pageData="pageDataTpl"
      pagetype="preview"
    >
    </EngineH5Swiper>
    <EngineH5Swiper
      id="footer"
      :nopt="true"
      style="display: none"
      v-if="showPreview"
      @closePreview="showPreview = false"
      :pageData="pageFooterTpl"
      pagetype="preview"
    >
    </EngineH5Swiper>
  </div>
</template>
<script>
import EngineH5Swiper from '@/components/engine-h5-swiper/src/index'
import mixin from '@/mixins/mixin'
import bus from '@/utils/bus'
import {
  headStr,
  footStr,
  openFixedAreaStr,
  pageStr1,
  pageStr2,
  pageStrStyle,
  pageStrStyleB
} from './tpl-config'
import '@/common/styles/index.scss'

export default {
  name: 'Editor',
  componentName: 'Editor',
  props: {
    tpls: {
      type: Array,
      default: () => []
    }
  },
  inject: ['modelId'],
  mixins: [mixin],
  data () {
    return {
      showPreview: false,
      pageDataTpl: () => { },
      pageHeaderTpl: () => { },
      pageFooterTpl: () => { },
      pageType: 'editor'
    }
  },
  components: {
    EngineH5Swiper
  },
  watch: {
    tpls (vals) {
      this.$store1.dispatch(this.modelId + '/setTableTpl', vals)
    }
  },
  created () {
    this.$store1.dispatch(this.modelId + '/setTableTpl', this.tpls)

    bus.$on('updateSpChars', (spCharacters) => {
      this.$emit('updateSpChars', spCharacters)
    })

    // imagepicker内容有变化通知外部
    bus.$on('updateImages', (res) => {
      this.$emit('updateImages', res)
    })

    bus.$on('applyTableTpl', (id) => {
      this.$emit('applyTableTpl', id)
    })
  },
  methods: {
    /**
     * @description: 编辑报告时更新元素api
     * @param {*} threshold
     * @param {*} value
     * @param {*} img
     * @return {*}
     */
    updateElement (threshold, value, img = '') {
      if (!threshold || !value) {
        return
      }
      console.log(img)
      this.$store1.dispatch(this.modelId + '/updateElementValue', { threshold, value })
      if (img) {
        this.$store1.dispatch(this.modelId + '/updateElementSign', { threshold, img })
      }
    },
    applyTableTpl (tpl) {
      bus.$emit('applyTableTplDetail', tpl)
    },
    /**
     * @description: 保存编辑模版对象，用于重新编辑
     * @param {*}
     * @return {*}
     */
    save (isLeave) {
      let obj = {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
      }
      if (isLeave) {
        this.$emit('leaveEditor', {
          editedData: {
            ...obj,
            height: obj.height
          }
        })
      } else {
        this.savePrintTpl(obj)
      }
    },
    /**
     * @description: 富文本框存为模版时，替换其中的输入框和下拉框
     * @param {*} editorVal
     * @return {*}
     */
    resetEditorValue (editorVal, editorIndex) {
      // 处理输入框
      editorVal = this.replaceFormInner('input', editorVal, editorIndex)
      // 处理下拉框
      editorVal = this.replaceFormInner('select', editorVal, editorIndex)
      return editorVal
    },
    /**
     * @description: 处理表单值替换
     * @param {*} type 表单类型
     * @param {*} editorVal 富文本内容字符串
     * @param {*} editorIndex 富文本框下标
     * @return {*}
     */
    replaceFormInner (type, editorVal, editorIndex) {
      let regexp = type === 'input' ? new RegExp(/<input[\s\S]*?>/ig) : new RegExp(/<select[\s\S]*?<\/select>/ig)
      let obj = document.getElementById(`preview${editorIndex}container`)?.getElementsByClassName('ke-edit-iframe')?.[0]?.contentWindow
      let inps = editorVal.match(regexp)
      if (inps && inps.length) {
        for (let i = inps.length - 1; i >= 0; i--) {
          const id = inps[i].match(/(id="(.*?)")/)[2]
          let realText = ''
          if (type === 'input') {
            realText = obj.document.getElementById(id).value
          } else {
            let options = obj.document.getElementById(id).options
            let checkedLen = 0
            for (let j = 0; j < options.length; j++) {
              if (options[j].selected) {
                realText += (checkedLen === 0 ? '' : ',') + options[j].label
                checkedLen++
              }
            }
          }
          editorVal = editorVal.replace(inps[i], realText)
        }
      }
      return editorVal
    },
    /**
     * @description: 保存打印模版对象，用于后端生成打印快照和预览
     * @param {*} obj
     * @return {*}
     */
    savePrintTpl (obj) {
      // 处理全部组件
      let eles = JSON.parse(JSON.stringify(obj)).elements
      let pageHeight = obj.height, offsetHeight = 0, bodyEles = []
      const { fixedHeader, fixedFooter } = this.pageData
      let headerObj = {
        height: fixedHeader.openFixed ? fixedHeader.height : 0,
        width: this.pageData.width,
        elements: []
      }
      let footerObj = {
        height: fixedFooter.openFixed ? fixedFooter.height : 0,
        width: this.pageData.width,
        elements: []
      }
      if (!eles || eles.length === 0) {
        return
      }
      let clientHeight = 0
      let inFooter = false
      let newImgPHeight = 0
      for (let i = 0; i < eles.length; i++) {
        let last = eles[i - 1] || null, setHeight = 0, eleHeight = eles[i].commonStyle.height

        if (eles[i].elName === 'rad-imagepicker') {
          newImgPHeight = this.calcImagePickerRelHeight(eles[i], eleHeight, eleHeight)
        }
        // 富文本框
        if (eles[i].elName === 'rad-editor') {
          eles[i].value = this.resetEditorValue(eles[i].value, i)
        }
        // 根据上一个元素的特殊性处理偏移
        if (last) {
          setHeight = last.commonStyle.height
          clientHeight = inFooter ? clientHeight : last.commonStyle.height
          // 处理imagepicker高度
          if (last.elName === 'rad-imagepicker') {
            clientHeight = this.calcImagePickerRelHeight(last, clientHeight, setHeight)
            if (bodyEles[i - 1] && bodyEles[i - 1].commonStyle) {
              bodyEles[i - 1].commonStyle.height = newImgPHeight
            }
          }
          // 处理表格高度
          if (last.elName === 'rad-table') {
            clientHeight = (document.getElementById(`preview${i - 1}container`) && document.getElementById(`preview${i - 1}container`)
              .clientHeight) || 0
          }
          // 处理富文本框高度
          if (last.elName === 'rad-editor') {
            last.innerHeight = last.innerHeight || 200
            const { fontSize, lineHeight } = last.commonStyle
            clientHeight = last.innerHeight + (last.title ? parseInt(fontSize) * lineHeight : 0)
            last.innerHeight = clientHeight
          }
        }

        // 碰到页尾内部的元素，因为元素是按top排序的，所以走到这一步，下面的元素都在页尾区域
        let tp = eles[i].commonStyle.top
        let eleStyle = eles[i].commonStyle
        if (fixedFooter.openFixed && fixedFooter.height > this.pageData.height - parseInt(tp)) {
          eleStyle.top =
            fixedFooter.height - this.pageData.height + parseInt(tp)
          footerObj.elements.push({
            ...eles[i],
            ...eleStyle
          })
          inFooter = true
        } else if (fixedHeader.openFixed && fixedHeader.height > parseInt(tp) + eleStyle.height) {
          // 处理页眉内部元素
          headerObj.elements.push(eles[i])
        } else {
          // 主体元素处理
          offsetHeight += setHeight - clientHeight
          eleStyle.top =
            eleStyle.top - offsetHeight - (fixedHeader.openFixed ? fixedHeader.height : 0)
          bodyEles.push(eles[i])
        }
      }

      pageHeight = bodyEles[bodyEles.length - 1].commonStyle.top + clientHeight + 40

      // 构建渲染预览页面obj
      this.pageDataTpl = JSON.parse(
        JSON.stringify({
          ...obj,
          height: pageHeight,
          elements: bodyEles
        })
      )
      this.pageHeaderTpl = headerObj
      this.pageFooterTpl = footerObj
      this.showPreview = true

      // 推送给入口整体数据结构，包含obj格式和tpl
      setTimeout(() => {
        let inner = document.getElementById('body').innerHTML
        let header = document.getElementById('header').innerHTML
        let footer = document.getElementById('footer').innerHTML

        this.$emit('saveEditor', {
          editedData: {
            ...obj,
            height: pageHeight
          },
          bodyTpl: `${headStr}${inner}${footStr}`,
          header: fixedHeader.openFixed ? `
            ${+fixedHeader.page ? openFixedAreaStr : headStr}
            ${+fixedHeader.page ? pageStrStyle + (+fixedHeader.page === 1 ? pageStr1 : pageStr2) : ''}
            ${header}
            ${footStr}` : '',
          footer: fixedFooter.openFixed ? `
            ${+fixedFooter.page ? openFixedAreaStr : headStr}
            ${+fixedFooter.page ? pageStrStyleB + (+fixedFooter.page === 1 ? pageStr1 : pageStr2) : ''}
            ${footer}
            ${footStr}` : ''
        })
        this.showPreview = false
      }, 500)
    },
    /**
     * @description: 处理图片选择器的占位问题
     * @param {*} last
     * @param {*} clientHeight
     * @return {*}
     */
    calcImagePickerRelHeight (last, clientHeight, setHeight) {
      const { imagepicker, linepics, picDis, fixType } = last.propsValue
      if (last.value.length === 0) {
        clientHeight = 0
      } else {
        let maxRow = Math.ceil(imagepicker / linepics)
        let len = last.value.length
        let sqr = Math.sqrt(len)
        switch (fixType) {
          case 1:
            // 优先铺满宽度，高度需要根据实际图片数量计算
            clientHeight = ((setHeight * Math.ceil(last.value.length / linepics)) /
              Math.ceil(imagepicker / linepics))
            break
          case 2:
            // 撑满预设高度
            clientHeight = last.commonStyle.height
            break
          case 3:
            // 宽高固定自适应，实际高度计算
            if (sqr % 1 !== 0) {
              sqr = Math.ceil(sqr)
            }
            if (sqr > maxRow) {
              sqr = maxRow
            }
            // 判断图片是否占满高度
            clientHeight = ((last.commonStyle.height - picDis * (sqr - 1)) / maxRow) * Math.ceil(len / sqr)
        }
      }
      return clientHeight
    }
  }
}
</script>
<style lang="scss">
.edit-wrapper {
  position: relative;
  overflow-y: auto;
  flex: 1;
  .editor-main {
    flex: 1;
    overflow: hidden;
    background-color: $page-bg-deepcolor;
    position: relative;
  }
  .swiper-slide {
    margin: 0 auto;
    background: $page-bg-color;
    overflow: visible;
  }
  .el-input__inner {
    padding: 1px !important;
  }
  .el-input__prefix {
    display: none !important;
  }
}
</style>
