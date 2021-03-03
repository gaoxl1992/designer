<template>
  <div class="rad-text" :style="lineHeight">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'RadText', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    text: {
      type: String,
      default: '占位'
    },
    element: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    lineHeight () {
      return {
        'line-height': (this.element?.commonStyle?.height || 40) + 'px'
      }
    }
  },
  created () {
    this.text = (this.element && this.element.value) || this.text
  }
}
</script>
