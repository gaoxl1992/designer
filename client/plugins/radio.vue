<!--
 * @Description: 
 * @props: 
-->
<!--
 * @Description: 
 * @props: 
-->
<template>
  <div class="rad-radio">
    <el-radio-group v-model="defaultOption"
                    :size="size"
                    :disabled="disabledValue || pagetype === 'designer'">
      <el-radio v-for="(option, index) in options"
                :key="index"
                :label="index">
        {{ option }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadRadio', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    options: {
      type: Array,
      default: () => []
    },
    radio: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    element: {
      type: Object,
      default: () => {}
    },
    pagetype: String
  },
  created() {
    this.defaultOption = (this.element && this.element.value) || 0
  },
  data() {
    return {
      defaultOption: this.radio - 1,
      disabledValue: this.disabled
    }
  },
  watch: {
    'element.value' (val) {
      this.$emit('update:value', val)
    },
    radio(val) {
      this.defaultOption = val - 1
    },
    disabled(val) {
      this.disabledValue = val
    },
    defaultOption(val) {
      this.$emit('update:value', val)
    }
  }
}
</script>

<style lang="scss">
.rad-radio {
  .el-radio-group,
  .el-radio,
  .el-radio__label {
    color: inherit !important;
    font-size: inherit !important;
    font-weight: inherit;
  }
}
</style>