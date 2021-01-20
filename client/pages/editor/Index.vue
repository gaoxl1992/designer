<template>
  <div class="edit-wrapper">
    <div class="editor-main">
      <EngineH5Swiper :pageData="pageData"
                      pagetype="editor">
      </EngineH5Swiper>
    </div>
    <!--预览 用于生成html-->
    <EngineH5Swiper id="header"
                    style="display: none"
                    v-if="showPreview"
                    @closePreview="showPreview = false"
                    :pageData="pageHeaderTpl"
                    pagetype="preview">
    </EngineH5Swiper>
    <EngineH5Swiper id="body"
                    style="display: none"
                    v-if="showPreview"
                    @closePreview="showPreview = false"
                    :pageData="pageDataTpl"
                    pagetype="preview">
    </EngineH5Swiper>
    <EngineH5Swiper id="footer"
                    style="display: none"
                    v-if="showPreview"
                    @closePreview="showPreview = false"
                    :pageData="pageFooterTpl"
                    pagetype="preview">
    </EngineH5Swiper>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import EngineH5Swiper from '@client/components/engine-h5-swiper/src/index'
import {
  headStr,
  footStr,
  openFixedAreaStr,
  pageStr1,
  pageStr2
} from './tpl-config'
export default {
  name: 'Editor',
  props: {
    tpls: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showPreview: false,
      pageDataTpl: () => {},
      pageHeaderTpl: () => {},
      pageFooterTpl: () => {}
    }
  },
  computed: {
    ...mapState({
      tableTpl: (state) => state.editor.tableTpl,
      pageData: (state) => state.editor.pageData
    })
  },
  components: {
    EngineH5Swiper
  },
  created() {
    this.$store.dispatch('setPageData')
    this.$store.dispatch('setTableTpl', this.tpls)
  },
  methods: {
    /**
     * @description: 保存编辑模版对象，用于重新编辑
     * @param {*}
     * @return {*}
     */
    save() {
      let obj = {
        radio: this.pageData.height / this.pageData.width,
        ...this.pageData
      }
      this.savePrintTpl(obj)
    },
    /**
     * @description: 保存打印模版对象，用于后端生成打印快照和预览
     * @param {*} obj
     * @return {*}
     */
    savePrintTpl(obj) {
      // 处理全部组件
      let eles = JSON.parse(JSON.stringify(obj)).elements
      let pageHeight = obj.height
      let offsetHeight = 0
      let bodyEles = []
      const { fixedHeader, fixedFooter } = this.pageData
      let headerObj = {
        height: fixedHeader.openFixed ? fixedHeader.height : 0,
        elements: []
      }
      let footerObj = {
        height: fixedFooter.openFixed ? fixedFooter.height : 0,
        elements: []
      }
      for (let i = 0; i < eles.length; i++) {
        let last = eles[i - 1] || null
        let setHeight = 0
        let clientHeight = 0
        if (last) {
          setHeight = last.commonStyle.height
          clientHeight = last.commonStyle.height
          // 处理imagepicker高度
          if (last.elName === 'rad-imagepicker') {
            const { imagepicker, linepics } = last.propsValue
            clientHeight =
              (setHeight * Math.ceil(last.value.length / linepics)) /
              Math.ceil(imagepicker / linepics)
          }
          // 处理表格高度
          if (last.elName === 'rad-table') {
            clientHeight = document.getElementById(`preview${i - 1}container`)
              .clientHeight
          }

          // 处理富文本框高度
          if (last.elName === 'rad-editor') {
            if (!last.innerHeight) {
              last.innerHeight = 200
            }
            const { fontSize, lineHeight } = last.commonStyle
            let titleHeight = last.title ? parseInt(fontSize) * lineHeight : 0
            clientHeight = last.innerHeight + titleHeight - 46
          }
        }

        // 碰到页尾内部的元素，因为元素是按top排序的，所以走到这一步，下面的元素都在页尾区域
        let tp = eles[i].commonStyle.top
        if (
          fixedFooter.openFixed &&
          fixedFooter.height > this.pageData.height - parseInt(tp)
        ) {
          eles[i].commonStyle.bottom =
            obj.height - eles[i].commonStyle.top - eles[i].commonStyle.height
          eles[i].commonStyle.top = null
          footerObj.elements.push(eles[i])
          continue
        }

        // 处理页眉内部元素
        if (
          fixedHeader.openFixed &&
          fixedHeader.height > parseInt(tp) + eles[i].commonStyle.height
        ) {
          headerObj.elements.push(eles[i])
          continue
        }
        offsetHeight += setHeight - clientHeight
        eles[i].commonStyle.top =
          eles[i].commonStyle.top - offsetHeight - fixedHeader.height
        bodyEles.push(eles[i])
      }

      pageHeight =
        bodyEles[bodyEles.length - 1].commonStyle.top +
        bodyEles[bodyEles.length - 1].commonStyle.height +
        20 -
        fixedHeader.height

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
          header: `
            ${
              fixedHeader.openFixed && fixedHeader.pageNum
                ? openFixedAreaStr
                : headStr
            }
            ${
              fixedHeader.openFixed
                ? fixedHeader.pageNum === 1
                  ? pageStr1
                  : pageStr2
                : ''
            }
            ${header}
            ${footStr}`,
          footer: `
            ${
              fixedFooter.openFixed && fixedFooter.pageNum
                ? openFixedAreaStr
                : headStr
            }
            ${footer}
            ${
              fixedFooter.openFixe
                ? fixedFooter.pageNum === 1
                  ? pageStr1
                  : pageStr2
                : ''
            }
            ${footStr}`
        })
      }, 500)
    },
    /**
     * @description: 重置页面数据，供外部通过ref重置编辑页数据 start
     * @param {*} pageData
     * @return {*}
     */
    resetPage(pageData) {
      const {
        pageType,
        radio,
        totalPages,
        elements,
        width,
        fixedFooter,
        fixedHeader,
        customWidth,
        customHeight
      } = pageData
      let rd = width / this.pageData.width
      this.$store.dispatch('setPageData', {
        ...this.pageData,
        customWidth,
        customHeight,
        pageType,
        totalPages,
        fixedFooter: {
          ...fixedFooter,
          height: fixedFooter.height / rd
        },
        fixedHeader: {
          ...fixedHeader,
          height: fixedHeader.height / rd
        }
      })
      this.$store.dispatch('updateCanvasHeight', this.pageData.width * radio)
      this.resetEles(elements, rd)
    },
    resetEles(eles, rd) {
      this.pageData.elements = []
      function compare(args) {
        return function (a, b) {
          return a[args].top - b[args].top
        }
      }

      // 为了方便只读模式和打印模版的抽离，对组件按定位排序
      eles = eles.sort(compare('commonStyle'))

      // 处理换屏宽时，组件的默认样式
      eles.forEach((item) => {
        // 处理导入控件的位置，根据当前视窗宽度做换算，高度不算，因为会产生遮挡hhh
        item.commonStyle.width = item.commonStyle.width / rd
        item.commonStyle.left =
          item.commonStyle.left > 10
            ? item.commonStyle.left / rd
            : item.commonStyle.left
        item.commonStyle.top = item.commonStyle.top / rd
        item.commonStyle.height = item.commonStyle.height / rd

        setTimeout(() => {
          this.$store.dispatch('importElement', item)
        }, 10)
      })
    }
    /** 重置页面数据，供外部通过ref重置编辑页数据 end */
  },
  watch: {
    'pageData.spCharacters'(val, oldVal) {
      if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
        this.$emit('updateSpChars', val)
      }
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
    overflow: auto;
    background: #cfd6e6;
    position: relative;
  }
  .swiper-slide {
    margin: 0 auto;
    background: #fff;
    padding: 10px;
  }
  .el-input__inner {
    padding: 1px !important;
  }
  .el-input__prefix {
    display: none !important;
  }
  .editor-page-edit-wrapper {
    width: 260px;
    min-width: 260px;
    padding: 0 1px;
  }
}
</style>
