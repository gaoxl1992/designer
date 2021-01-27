<template>
  <div class="rad-line">
    <div class="el-divider el-divider--horizontal"
         :style="{ height: tempLine + 'px', backgroundColor: tempColor }"></div>
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
  data () {
    return {
      tempLine: this.line,
      tempColor: this.lineColor
    }
  },
  watch: {
    line (val) {
      this.tempLine = val
    },
    lineColor (val) {
      this.tempColor = val
    }
  }
}
</script>
