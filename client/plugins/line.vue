<template>
  <div class="rad-line">
    <div class="el-divider el-divider--horizontal"
         :style="{ height: line + 'px', backgroundColor: tempColor }"></div>
  </div>
</template>

<script>
export default {
  name: 'RadLine',
  props: {
    line: {
      type: Number,
      default: 1
    },
    lineColor: {
      type: String,
      default: '#333'
    }
  },
  computed: {
    tempColor () {
      return this.lineColor
    }
  },
}
</script>
