<template>
  <div>
    <el-form-item label="默认值">
      <el-input small="small"
                type="text"
                v-model="tempInput"> </el-input>
    </el-form-item>
    <el-form-item label="标签">
      <el-input small="small"
                type="text"
                v-model="tempLabel"> </el-input>
    </el-form-item>
    <el-form-item label="placeholder">
      <el-input size="small"
                type="text"
                v-model="tempPlaceholder"> </el-input>
    </el-form-item>
    <el-form-item label="类型">
      <el-radio size="small"
                v-model="tempInputType"
                label="text">单行文本</el-radio>
      <el-radio size="small"
                v-model="tempInputType"
                label="textarea">多行文本</el-radio>
    </el-form-item>
    <el-form-item label="尺寸"
                  v-if="tempInputType === 'text'">
      <el-radio size="small"
                v-model="tempSize"
                label="mini">小</el-radio>
      <el-radio size="small"
                v-model="tempSize"
                label="small">标准</el-radio>
      <el-radio size="small"
                v-model="tempSize"
                label="medium">大</el-radio>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-input',
  props: {
    input: String,
    label: String,
    placeholder: String,
    inputType: String,
    size: String,
    disabled: Boolean
  },
  data() {
    return {
      tempInput: '',
      tempLabel: '',
      tempPlaceholder: '',
      tempInputType: '',
      tempSize: '',
      editable: true
    }
  },
  mounted() {
    this.tempInput = this.input
    this.tempLabel = this.label
    this.tempPlaceholder = this.placeholder
    this.tempInputType = this.inputType
    this.tempSize = this.size
    this.editable = !this.disabled
  },
  watch: {
    input(val) {
      this.tempInput = val
    },
    label(val) {
      this.tempLabel = val
    },
    placeholder(val) {
      this.tempPlaceholder = val
    },
    inputType(val) {
      this.tempInputType = val
    },
    size(val) {
      this.tempSize = val
    },
    disabled(val) {
      this.tempDisabled = val
    },
    tempInput(val) {
      this.$emit('update:input', val)
    },
    tempLabel(val) {
      this.$emit('update:label', val)
    },
    tempPlaceholder(val) {
      this.$emit('update:placeholder', val)
    },
    tempInputType(val) {
      this.$emit('update:inputType', val)
    },
    tempSize(val) {
      this.$emit('update:size', val)
    },
    editable(val) {
      this.$emit('update:disabled', !val)
    }
  }
}
</script>

<style lang="scss">
.el-form-item {
  margin-bottom: 10px;
}
</style>
