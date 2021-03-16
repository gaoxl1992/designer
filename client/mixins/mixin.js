import {
  mapState,
  mapGetters
} from 'vuex'
import {
  dealWithScript
} from '@/utils/mUtils'
export default {
  created() {
    this.$store.dispatch('setPageData')
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementsUUID: (state) => state.editor.activeElementsUUID,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      tableTpl: (state) => state.editor.tableTpl,
      historyCache: (state) => state.editor.historyCache
    }),
    ...mapGetters(['activeElement'])
  },
  methods: {
    setDomain(domainList = []) {
      this.pageData.domainList = domainList
    },
    /**
     * @description: 该方法提供给外部调用，可以根据数据结构更新当前模版----导入或复用可用此方法
     * @param {*} pageData
     * @return {*}
     */
    resetPage(pageData = null, spCharacters = [], domainList = []) {
      this.$store.dispatch('setPageData')
      this.$store.dispatch('setActiveElementUUID', '')
      if (!pageData) {
        this.pageData.domainList = domainList
        this.tempCacheLength = this.historyCache.length
        return
      }
      // 挂载绑定域值的组件，用于控件脚本取值
      window.report = window.report || {};
      const {
        pageType,
        radio,
        totalPages,
        elements,
        width,
        fixedHeader,
        fixedFooter,
        customWidth,
        customHeight,
        name,
        id,
        outerPadding
      } = pageData
      let rd = width / this.pageData.width
      this.$store.dispatch('setPageData', {
        ...this.pageData,
        customWidth,
        customHeight,
        pageType: pageType ? pageType : 'a4',
        totalPages,
        name,
        id,
        outerPadding,
        spCharacters: spCharacters || [],
        domainList: domainList || [],
        fixedFooter: fixedFooter ? {
          ...fixedFooter,
          height: fixedFooter.openFixed ? fixedFooter.height / rd : 0
        } : {},
        fixedHeader: fixedHeader ? {
          ...fixedHeader,
          height: fixedHeader.openFixed ? fixedHeader.height / rd : 0
        } : {}
      })
      this.$store.dispatch('updateCanvasHeight', this.pageData.width * radio)
      this.resetEles(elements, rd)
      window.report.pageData = this.pageData
    },
    /**
     * @description: 重载控件属性
     * @param {*} eles
     * @param {*} rd
     * @return {*}
     */
    resetEles(eles, rd) {
      this.pageData.elements = []
      this.tempCacheLength = 0

      function compare(args) {
        return function (a, b) {
          return a[args].top - b[args].top
        }
      }
      // 为了方便只读模式和打印模版的抽离，对组件按定位排序
      eles = eles.sort(compare('commonStyle'))

      eles.forEach((item) => {
        // 处理导入控件的位置，根据当前视窗宽度做换算，高度不处理，因为会产生遮挡hhh
        item.commonStyle.width = item.commonStyle.width / rd
        item.commonStyle.left =
          item.commonStyle.left > 10 ?
          item.commonStyle.left / rd :
          item.commonStyle.left
        item.commonStyle.top = item.commonStyle.top / rd
        item.commonStyle.height = item.commonStyle.height / rd
        item.rd = rd

        if (this.pageType === 'editor' && item.script) {
          dealWithScript(item, 'initPage', this.pageData)
        }
        setTimeout(() => {
          this.$store.dispatch('importElement', item)
          this.tempCacheLength++
        }, 10)
      })
    }
  }
}