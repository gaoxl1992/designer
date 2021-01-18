<template>
  <div v-if="currentElementProps.length">
    <div class="attr-title marginB10 fontBold">组件属性</div>
    <el-form>
      <component v-for="item in currentElementProps"
                 :key="item"
                 :is="'attr-rad-' + item"
                 v-bind.sync="activeElement.propsValue" />
    </el-form>
  </div>
</template>

<script>
import attrComponents from './index.js'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    ...attrComponents
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters(['activeElementIndex', 'activeElement']),
    /**
     * 当前选中元素需要编辑得props 列表
     */
    currentElementProps() {
      if (!this.activeElement.propsValue) {
        return []
      }
      let keyList = Object.keys(this.activeElement.propsValue)
      let editPropsComponentNameList = Object.keys(attrComponents)
      // 过滤掉找不到对应attr props编辑组件的key
      keyList = keyList.filter((v) => {
        return editPropsComponentNameList.includes('attr-rad-' + v)
      })
      return keyList
    }
  }
}
</script>