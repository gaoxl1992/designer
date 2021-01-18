<template>
  <div class="rad-line">
    <div class="el-divider el-divider--horizontal"
         :style="{ height: tempLine + 'px' }"></div>
  </div>
</template>

<script>
export default {
  name: 'RadLine', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    line: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      tempLine: this.line
    }
  },
  watch: {
    line(val) {
      this.tempLine = val
    }
  }
}
</script>
