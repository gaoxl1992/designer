<!--
 * @Description: 模版引擎
-->
<template>
  <div
    class="rad-element-wrapper"
    :class="'rad-element-wrapper-preview' + editorId"
    @click="handleClick"
  >
    <component
      @update:value="updateValue"
      :is="element.elName"
      :commonStyle="element.commonStyle"
      :element="element"
      class="rad-element ani"
      v-bind="element.propsValue"
      :editorId="'preview' + editorId"
      :pagetype="pagetype"
      @focusEditor="focusEditor"
      :focusEditorId="focusEditorId"
    />
  </div>
</template>

<script>
import { _register_components_object } from '@/plugins/index'
import {
  dealWithScript
} from '@/utils/mUtils'
import {
  mapState
} from 'vuex'

export default {
  name: 'components-template',
  components: {
    // 批量注册组件
    ..._register_components_object
  },
  inject: ['modelId'],
  computed: {
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
      }
    })
  },
  props: {
    loaded: Boolean,
    // 元素数据
    element: {
      type: Object,
      require: true
    },
    editorId: Number,
    pagetype: {
      type: String,
      default: ''
    },
    focusEditorId: {
      type: String,
      default: ''
    },
    zoom: {
      type: String,
      default: ''
    }
  },
  methods: {
    focusEditor (e) {
      this.$emit('focusEditor', e)
    },
    async handleClick () {
      // 编辑模式点击组件处理脚本
      if (this.pagetype === 'editor') {
        dealWithScript(this.element, 'onclick', this.modelId)
      }
      this.$emit('handleElementClick', this.element.events, this.element)
    },
    updateValue (eleVal) {
      this.element.value = eleVal
      if (this.pagetype === 'editor') {
        dealWithScript(this.element, 'onchange', this.modelId)
      }
    }
  }
}
</script>
