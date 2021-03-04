<template>
  <div class="rad-operator">
    <el-form :inline="true">
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
            class="el-input"
            :class="'el-input--' + size"
          >
            <input
              v-if="pagetype === 'designer' || (pagetype ==='editor' && !disabledValue)"
              :disabled="disabledValue || pagetype==='designer'"
              v-model="inputValue"
              type="text"
              autocomplete="off"
              :placeholder="placeholderValue"
              class="el-input__inner"
              :class="'el-input__inner_' +  pagetype"
            />
            <div
              class="preview-input"
              :style="previewStyle"
              v-else
            >{{inputValue}}</div>
          </div>
        </div>
        <template v-if="openSign">
          <div
            v-if="pagetype === 'designer'"
            class="operator-sign"
            :style="signStyle"
          >
            签名控件
          </div>
          <div
            v-else-if="imageUrlTemp"
            class="operator-sign"
            :style="signStyle"
          >
            <img
              :src="imageUrlTemp"
              alt=""
              style="height: 100%;width: 100%"
            />
          </div>
        </template>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'RadOperator',
  props: {
    operator: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
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
    },
    openSign: {
      type: Boolean,
      default: true
    },
    signWidth: {
      type: Number,
      default: 80
    },
    signHeight: {
      type: Number,
      default: 40
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  created () {
    this.inputValue = (this.element && this.element.value) || ''
  },
  data () {
    return {
      inputValue: this.operator,
      placeholderValue: this.placeholder,
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
        'white-space': 'nowrap',
        'padding-left': '2px',
        'text-align': 'left'
      },
      labelStyle: {
        width: 'fit-content',
        'min-width': 'fit-content',
        'padding-right': '5px'
      },
      itemContentStyle: {
        display: 'inline-block'
      },
      imageUrlTemp: this.imageUrl
    }
  },
  computed: {
    signStyle () {
      return {
        'margin-left': '5px',
        display: 'inline-block',
        height: this.signHeight + 'px',
        'line-height': this.signHeight + 'px',
        width: this.signWidth + 'px',
        'text-align': 'center'
      }
    }
  },
  watch: {
    'element.propsValue.imageUrl' (val) {
      this.imageUrlTemp = val
    },
    'element.value' (val) {
      this.inputValue = val
    },
    operator (val) {
      this.inputValue = val
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
.rad-operator {
  .el-input {
    height: 100%;
    width: 80px;
  }
  .operator-sign {
    display: inline-block;
    border: 1px solid $line-color;
    border-radius: 2px;
    margin-left: 5px;
    font-size: 16px;
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
}
</style>