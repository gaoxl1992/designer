<template>
  <div class="rad-radio">
    <el-radio-group v-model="defaultOption"
                    :disabled="disabledValue || pagetype !== 'editor'">
      <el-radio v-for="(option, index) in radio"
                :key="index"
                :label="option.value"
                :disabled="option.disabled"
                :class="{'input-len': option.addInput}">
        {{ option.value }}
        <el-input
          size="mini"
          v-if="option.addInput && pagetype !== 'preview'"
          :disabled="option.disabled || disabledValue || pagetype !== 'editor'"
          v-model="option.input"
        >
        </el-input>
        <span class="el-input__inner ellipsis" v-if="option.addInput && pagetype === 'preview'">
          {{option.input}}
        </span>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  name: 'RadRadio', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    radio: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    element: {
      type: Object,
      default: () => {}
    },
    pagetype: String,
    defaultChecked: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      disabledValue: this.disabled,
      defaultOption: this.defaultChecked,
    }
  },
  mounted () {
    if (this.element?.value) {
      this.defaultOption = this.element.value
    }
  },
  watch: {
    disabled (val) {
      this.disabledValue = val
    },
    defaultChecked (val) {
      this.defaultOption = val
    },
    defaultOption (val) {
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
  .input-len {
    display: block;
  }
  .el-input {
    display: table-cell;
  }
  .el-input__inner {
    line-height: 1;
    height: 100%;
    padding: 5px 15px;
    display: inline-block;
    width: 200px;
  }
}
</style>