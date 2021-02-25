<template>
  <div class="attr-rad-drcode">
    <el-form-item label="链接">
      <el-input
        type="textarea"
        clearable
        :rows="2"
        placeholder="请输入文本内容"
        v-model="tempText"
      >
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-drcode',
  props: {
    drcode: String
  },
  data () {
    return {
      tempDrcode: ''
    }
  },
  mounted () {
    this.tempDrcode = this.drcode
  },
  watch: {
    drcode (val) {
      this.tempDrcode = val
    },
    tempDrcode (val) {
      this.$emit('update:drcode', val)
    }
  }
}
</script>
