<template>
  <el-form
    class="rad-input"
    :inline="true"
  >
    <div
      class="el-form-item"
      :style="formItemStyle"
    >
      <label
        class="el-form-item__label"
        :class="'el-form-item__label_' + pagetype"
        v-if="labelValue"
      >{{ labelValue }}</label>
      <div
        class="el-form-item__content"
        :style="itemContentStyle"
      >
        <div
          v-if="pagetype === 'designer' || (pagetype ==='editor' && !disabledValue)"
          class="el-input"
          :class="'el-input--' + size"
        >
          <input
            :disabled="disabledValue || pagetype==='designer'"
            v-model="inputValue"
            :type="inputTypeValue"
            autocomplete="off"
            :placeholder="placeholderValue"
            class="el-input__inner"
            :class="'el-input__inner_' +  pagetype"
          />
        </div>
        <div
          class="preview-input"
          :style="previewStyle"
          v-else
        >{{inputValue}}</div>
      </div>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'RadInput', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    input: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    inputType: {
      type: String,
      default: 'text'
    },
    size: {
      type: String,
      default: 'small'
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pagetype: String,
    element: {
      type: Object,
      default: () => { }
    }
  },
  created () {
    this.inputValue = (this.element && this.element.value) || ''
  },
  data () {
    return {
      inputValue: this.input,
      placeholderValue: this.placeholder,
      inputTypeValue: this.inputType,
      sizeValue: this.size,
      labelValue: this.label,
      disabledValue: this.disabled,
      formItemStyle: {
        width: '100%',
        'white-space': 'nowrap',
        'text-align': 'left'
      },
      previewStyle: {
        'text-overflow': 'ellipsis',
        overflow: 'hidden',
        'white-space': 'nowrap'
      },
      itemContentStyle: {
        display: 'block'
      }
    }
  },
  watch: {
    input (val) {
      this.inputValue = val
    },
    inputType (val) {
      this.inputTypeValue = val
    },
    placeholder (val) {
      this.placeholderValue = val
    },
    size (val) {
      this.sizeValue = val
    },
    label (val) {
      this.labelValue = val
    },
    disabled (val) {
      this.disabledValue = val
    },
    inputValue (val) {
      this.$emit('update:value', val)
    }
  }
}
</script>
<style lang="scss">
.rad-input {
  .el-input {
    height: 100%;
  }
  input {
    display: block;
    width: 100%;
    height: 100%;
  }
  .el-input__inner {
    background-color: transparent;
    border: 1px solid #adb1b8;
  }
  .el-input__inner_preview {
    border: none;
    padding: 5px;
  }
  .el-form-item {
    width: 100%;
    white-space: nowrap;
  }
  .el-form-item__label {
    width: fit-content;
    min-width: fit-content;
    float: left;
  }
  .el-form-item__label_preview {
    padding-right: 0;
  }
  .el-input--small,
  .el-form-item__label,
  .el-form-item__content,
  input {
    font-size: inherit;
    font-weight: inherit;
    color: inherit !important;
    font-style: inherit;
  }
  .el-form-item__content {
    overflow: hidden;
  }
  .preview-input {
    padding-left: 2px;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
