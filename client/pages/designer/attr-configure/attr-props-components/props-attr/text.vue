<template>
  <div class="attr-rad-text">
    <el-form-item label="文本内容">
      <el-input type="textarea"
                clearable
                :rows="2"
                placeholder="请输入文本内容"
                v-model="tempText">
      </el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-text',
  props: {
    text: String
  },
  data () {
    return {
      tempText: ''
    }
  },
  mounted () {
    this.tempText = this.text
  },
  watch: {
    text (val) {
      this.tempText = val
    },
    tempText (val) {
      this.$emit('update:text', val)
    }
  }
}
</script>
