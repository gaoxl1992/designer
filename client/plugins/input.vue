<template>
  <el-form
    class="rad-input"
    :inline="true"
    @submit.native.prevent
  >
    <div
      class="el-form-item"
      :style="formItemStyle"
    >
      <label
        class="el-form-item__label"
        :style="pagetype === 'preview' ? labelStyle : {}"
        v-if="labelValue"
      >{{ labelValue }}</label>
      <div
        class="el-form-item__content"
        :style="itemContentStyle"
      >
        <div
          v-if="pagetype === 'designer' || (pagetype ==='editor' && !disabledValue)"
          :class="[
            inputTypeValue==='text' ? 'el-input': 'el-textarea',
            'el-input--' + size
          ]"
        >
          <input
            v-if="inputTypeValue === 'text'"
            :disabled="disabledValue || pagetype==='designer'"
            v-model="inputValue"
            :type="inputTypeValue"
            autocomplete="off"
            :placeholder="placeholderValue"
            :class="[
              inputTypeValue==='text' ? 'el-input__inner' : 'el-textarea__inner',
              'el-input__inner_' +  pagetype
            ]"
          />
          <textarea
            v-if="inputTypeValue === 'textarea'"
            :disabled="disabledValue || pagetype==='designer'"
            v-model="inputValue"
            :type="inputTypeValue"
            autocomplete="off"
            :placeholder="placeholderValue"
            :class="[
              inputTypeValue==='text' ? 'el-input__inner' : 'el-textarea__inner'
            ]"
          ></textarea>
        </div>
        <div
          class="preview-input"
          :style="{
            'text-overflow': inputTypeValue!=='text' ? '' : 'ellipsis',
            overflow: inputTypeValue!=='text' ? '' : 'hidden',
            'white-space': inputTypeValue!=='text' ? 'normal' : 'nowrap',
            'padding-left': '2px',
            'text-align': 'left',
            'line-height': inputTypeValue!=='text' ? '1.5' : '',
            display: inputTypeValue!=='text' ? 'table' : ''
          }"
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
    this.inputValue = (this.element && this.element.value) || this.input || ''
    this.$emit('update:value', this.inputValue)
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
      labelStyle: {
        width: 'fit-content',
        'min-width': 'fit-content',
        float: 'left',
        'padding-right': '5px'
      },
      itemContentStyle: {
        display: 'block'
      }
    }
  },
  watch: {
    'element.value' (val) {
      this.inputValue = val
    },
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
  .el-textarea__inner {
    resize: both !important;
    min-height: 38px !important;
  }
}
</style>
