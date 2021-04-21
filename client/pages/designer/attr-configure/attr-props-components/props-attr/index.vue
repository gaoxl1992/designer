<template>
  <div v-if="currentElementProps.length" @change="haveChanges">
    <div class="attr-title fontBold marginB20">组件属性</div>
    <el-form>
      <component
        v-for="item in currentElementProps"
        :key="item"
        :is="'attr-rad-' + item"
        v-bind.sync="activeElement.propsValue"
      />
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
  inject: ['modelId'],
  computed: {
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
      },
      activeElementUUID () {
        let state = this.$store1.state[this.modelId];
        return state?.activeElementUUID || ''
      }
    }),
    ...mapGetters({
      activeElementIndex() {
        return this.modelId + '/activeElementIndex'
      },
      activeElement() {
        return this.modelId + '/activeElement'
      }
    }),
    /**
     * 当前选中元素需要编辑得props 列表
     */
    currentElementProps () {
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
  },
  methods: {
    haveChanges () {
      this.$store1.dispatch(this.modelId + '/addHistoryCache')
    }
  },
}
</script>