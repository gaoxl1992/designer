<!--
 * @Description: 
 * @props: 
-->
<template>
  <div class="rad-element-wrapper"
       :class="'rad-element-wrapper-preview' + editorId"
       @click="handleClick">
    <component @update:value="updateValue"
               :is="element.elName"
               :commonStyle="element.commonStyle"
               :element="element"
               class="rad-element ani"
               v-bind="element.propsValue"
               :editorId="'preview' + editorId"
               :pagetype="pagetype" />
  </div>
</template>

<script>
import { _register_components_object } from '@/plugins/index'

export default {
  name: 'components-template',
  components: {
    // 批量注册组件
    ..._register_components_object
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
    }
  },
  methods: {
    async handleClick () {
      this.$emit('handleElementClick', this.element.events, this.element)
    },
    updateValue (e) {
      this.element.value = e
    }
  }
}
</script>
