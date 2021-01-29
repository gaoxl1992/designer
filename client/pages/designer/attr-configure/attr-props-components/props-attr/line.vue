<!--
 * @Description: 直线组件
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
    <el-form-item label="线色">
      <div class="attr-item-edit-input">
        <el-color-picker size="mini"
                         @change="handleColorChange"
                         v-model="tempColor"></el-color-picker>
      </div>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-line',
  props: {
    line: Number,
    lineColor: String
  },
  data () {
    return {
      tempLine: 1,
      tempColor: '#666'
    }
  },
  mounted () {
    this.tempLine = this.line
    this.tempColor = this.lineColor
  },
  watch: {
    line (val) {
      this.tempLine = val
    },
    lineColor (val) {
      this.tempColor = val
    }
  },
  methods: {
    handleColorChange (val) {
      this.$emit('update:lineColor', val)
    },
    handleChange (val) {
      this.$emit('update:line', val)
    }
  }
}
</script>