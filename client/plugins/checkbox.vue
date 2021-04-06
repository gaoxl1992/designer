<template>
  <div class="rad-checkbox">
    <el-checkbox-group v-model="tempCheckbox"
                       :disabled="disabledValue || pagetype!=='editor'">
      <el-checkbox v-for="(option, index) in checkboxOptions"
                   :key="index"
                   :label="option.value"
                   :class="{'input-len': option.addInput}"
                   :disabled="option.disabled">
        {{ option.value }}
        <el-input
          size="mini"
          v-if="option.addInput && pagetype !== 'preview'"
          :disabled="option.disabled || disabledValue || pagetype !== 'editor'"
          v-model="option.input"
        >
        </el-input>
        <span class="el-input__inner ellipsis" v-if="option.addInput && pagetype === 'preview'">{{option.input}}</span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  name: 'RadCheckbox', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    checkbox: {
      type: Array,
      default: () => []
    },
    element: {
      type: Object,
      default: () => {}
    },
    pagetype: String,
    defaultChecked: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      disabledValue: false,
      tempCheckbox: this.defaultChecked || [],
      tempDisabledItems: this.disabledItems || [],
      checkboxOptions: this.checkbox || []
    }
  },
  watch: {
    disabled(val) {
      this.disabledValue = val
    },
    'element.value' (val) {
      this.tempCheckbox = val
    },
    defaultChecked (val) {
      this.tempCheckbox = val
    },
    tempCheckbox (val) {
      this.$emit('update:value', val)
    },
    checkbox (val) {
      this.checkboxOptions = val
    },
    checkboxOptions: {
      handler (val) {
        console.log('cheeckbox', val)
      },
      deep: true,
      immediate: true
    }
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
    display: inline;
  }
  .input-len {
    display: block;
  }
  .el-input {
    display: table-cell;
  }
  .el-input__inner {
    line-height: 1;
    height: fit-content;
    padding: 5px 15px;
    display: inline-block;
    width: 200px;
  }
}
</style>