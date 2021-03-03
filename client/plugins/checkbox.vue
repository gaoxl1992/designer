<template>
  <div class="rad-checkbox">
    <el-checkbox-group v-model="tempCheckbox"
                       :size="size"
                       :disabled="disabledValue || pagetype==='designer'">
      <el-checkbox v-for="(option, index) in options"
                   :key="index"
                   :label="option"
                   :disabled="tempDisabledItems.includes(option)"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'RadCheckbox', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Array,
      default: () => []
    },
    disabledItems: {
      type: Array,
      default: () => []
    },
    element: {
      type: Object,
      default: () => {}
    },
    pagetype: String
  },
  created() {
    this.tempCheckbox = (this.element && this.element.value) || []
  },
  data() {
    return {
      disabledValue: false,
      tempCheckbox: [],
      tempDisabledItems: []
    }
  },
  watch: {
    disabled(val) {
      this.disabledValue = val
    },
    checkbox(val) {
      this.tempCheckbox = val
    },
    disabledItems(val) {
      this.tempDisabledItems = val
    },
    tempCheckbox(val) {
      this.$emit('update:value', val)
    },
    'element.value' (val) {
      this.tempCheckbox = val
    },
  }
}
</script>
<style lang="scss">
.rad-checkbox {
  .el-checkbox-group {
    font-size: inherit;
  }
  .el-checkbox__label,
  .el-checkbox__input,
  .el-checkbox {
    color: inherit !important;
    font-size: inherit !important;
    font-weight: inherit;
  }
  .el-checkbox__label {
    vertical-align: middle;
  }
}
</style>