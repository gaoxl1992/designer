<!--
 * @Description: 直线组件
 * @props: 
-->
<template>
  <div class="attr-rad-line">
    <el-form-item label="线宽">
      <el-input-number v-model="tempLine"
                       size="small"
                       controls-position="right"
                       :min="1"
                       @change="handleChange"></el-input-number>px
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-line',
  props: {
    line: Number
  },
  data() {
    return {
      tempLine: 1
    }
  },
  mounted() {
    this.tempLine = this.line
  },
  watch: {
    line(val) {
      this.tempLine = val
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('update:line', val)
    }
  }
}
</script>