<template>
  <el-form
    class="rad-datetime"
    :class="'rad-datetime-'+pagetype"
    :style="previewStyle"
    :inline="true"
  >
    <div class="el-form-item">
      <label
        class="el-form-item__label"
        :style="pagetype === 'preview' ? labelStyle : {}"
        v-if="labelValue"
      >{{ labelValue }}</label>
      <el-date-picker
        v-if="pagetype !== 'preview'"
        v-model="datemodel"
        :type="datetime"
        :format="format"
        editable
        :size="size"
        :disabled="disabledValue"
        placeholder="选择日期时间"
      >
      </el-date-picker>
      <div
        style="line-height: 30px"
        v-else
      >{{ previewDate }}</div>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'RadDatetime', // 这个名字很重要，它就是未来的标签名<rad-text></rad-text>
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    datetime: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      dafault: 'yyyy-MM-dd'
    },
    pagetype: String,
    element: {
      type: Object,
      default: () => { }
    },
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      datemodel: null,
      disabledValue: this.disabled || this.pagetype === 'designer',
      previewDate: '',
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
        float: 'left',
        'padding-right': '5px',
        'line-height': '30px'
      },
      labelValue: this.label
    }
  },
  created () {
    this.datemodel = (this.element && this.element.value) || (this.datetime.indexOf('range') === -1 ? new Date() : [new Date(), new Date()])
    if (this.pagetype === 'preview') {
      this.previewDate = this.formatDate(
        this.datemodel,
        this.element.propsValue.format
      )
    }
  },
  watch: {
    'element.value' (val) {
      this.datemodel = val
    },
    disabled (val) {
      this.disabledValue = val
    },
    datemodel (val) {
      this.$emit('update:value', val)
    },
    label (val) {
      this.labelValue = val
    }
  },
  methods: {
    formatDate (date, fmt = 'yyyy-MM-dd') {
      if (!date) {
        return ''
      }
      date = new Date(date)
      let o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds() //毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    }
  }
}
</script>
<style lang="scss">
.rad-datetime {
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
    padding: 0;
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
    line-height: 30px;
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
  .el-input__prefix,
  .el-input__suffix,
  .el-input__icon {
    display: none;
  }
  .el-range-input {
    width: calc((100% - 10px) / 2);
  }
  .el-range-separator {
    padding: 0;
    width: 10px;
  }
}
</style>
