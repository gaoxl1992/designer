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
      :nopt="true"
      :nopb="true"
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
import { mapState } from 'vuex'
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
  mixins: [mixin],
  data () {
    return {
      showPreview: false,
      pageDataTpl: () => { },
      pageHeaderTpl: () => { },
      pageFooterTpl: () => { }
    }
  },
  ...mapState({
    pageData: (state) => state.editor.pageData,
    activeElementUUID: (state) => state.editor.activeElementUUID,
    activeElementsUUID: (state) => state.editor.activeElementsUUID
  }),
  components: {
    EngineH5Swiper
  },
  created () {
    this.$store.dispatch('setTableTpl', this.tpls)

    bus.$on('updateSpChars', (spCharacters) => {
      this.$emit('updateSpChars', spCharacters)
    })
  },
  methods: {
    /**
     * @description: 保存编辑模版对象，用于重新编辑
     * @param {*}
     * @return {*}
     */
    save (ext = false) {
      let obj = {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
      }
      this.savePrintTpl(obj, ext)
    },
    /**
     * @description: 保存打印模版对象，用于后端生成打印快照和预览
     * @param {*} obj
     * @return {*}
     */
    savePrintTpl (obj, ext) {
      // 处理全部组件
      let eles = JSON.parse(JSON.stringify(obj)).elements
      let pageHeight = obj.height
      let offsetHeight = 0
      let bodyEles = []
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
      for (let i = 0; i < eles.length; i++) {
        let last = eles[i - 1] || null
        let setHeight = 0
        if (last) {
          setHeight = last.commonStyle.height
          clientHeight = inFooter ? clientHeight : last.commonStyle.height
          // 处理imagepicker高度
          if (last.elName === 'rad-imagepicker') {
            const { imagepicker, linepics } = last.propsValue
            clientHeight = last.value.length > 0 ?
              ((setHeight * Math.ceil(last.value.length / linepics)) /
                Math.ceil(imagepicker / linepics)) : 0
          }
          // 处理表格高度
          if (last.elName === 'rad-table') {
            clientHeight = (document.getElementById(`preview${i - 1}container`) && document.getElementById(`preview${i - 1}container`)
              .clientHeight) || 0
          }

          // 处理富文本框高度
          if (last.elName === 'rad-editor') {
            if (!last.innerHeight) {
              last.innerHeight = 200
            }
            const { fontSize, lineHeight } = last.commonStyle
            let titleHeight = last.title ? parseInt(fontSize) * lineHeight : 0
            clientHeight = last.innerHeight + titleHeight
            last.innerHeight = clientHeight
          }
        }

        // 碰到页尾内部的元素，因为元素是按top排序的，所以走到这一步，下面的元素都在页尾区域
        let tp = eles[i].commonStyle.top
        let eleStyle = eles[i].commonStyle
        if (
          fixedFooter.openFixed &&
          fixedFooter.height > this.pageData.height - parseInt(tp)
        ) {
          eleStyle.top =
            fixedFooter.height - this.pageData.height + parseInt(tp)
          footerObj.elements.push({
            ...eles[i],
            ...eleStyle
          })
          inFooter = true
        } else if (
          fixedHeader.openFixed &&
          fixedHeader.height > parseInt(tp) + eleStyle.height
        ) {
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

      pageHeight =
        bodyEles[bodyEles.length - 1].commonStyle.top +
        clientHeight +
        40

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
            ${footStr}` : '',
          ext
        })
      }, 500)
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
    overflow-y: auto;
    overflow-x: hidden;
    background-color: $page-bg-deepcolor;
    position: relative;
  }
  .swiper-slide {
    margin: 0 auto;
    background: $white;
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
