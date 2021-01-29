<template>
  <div class="rad-datetime"
       :class="'rad-datetime-'+pagetype"
       :style="previewStyle">
    <el-date-picker v-if="pagetype !== 'preview'"
                    v-model="datemodel"
                    :type="datetime"
                    :format="format"
                    editable
                    :size="size"
                    :disabled="disabledValue"
                    placeholder="选择日期时间">
    </el-date-picker>
    <div class="rad-datatime-preview"
         :style="{height: element.commonStyle.height + 'px', lineHeight: element.commonStyle.height + 'px'}"
         v-else>{{ previewDate }}</div>
  </div>
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
    }
  },
  data () {
    return {
      datemodel: '',
      disabledValue: this.disabled || this.pagetype === 'designer',
      previewDate: '',
      previewStyle: {
        'text-align': 'left'
      }
    }
  },
  created () {
    this.datemodel = (this.element && this.element.value) || new Date()
    if (this.pagetype === 'preview') {
      this.previewDate = this.formatDate(
        this.datemodel,
        this.element.propsValue.format
      )
    }
  },
  watch: {
    disabled (val) {
      this.disabledValue = val
    },
    datemodel (val) {
      this.$emit('update:value', val)
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
.rad-datetime-preview {
  .el-input__inner {
    background-color: transparent;
    border: none;
  }
  .el-input__prefix,
  .el-input__suffix {
    display: none;
  }
  .el-input__inner {
    padding: 0;
  }
  .rad-datatime-preview {
    padding-top: 4px;
  }
}
</style>