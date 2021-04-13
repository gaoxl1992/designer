<!--
 * @Description: 时间选择器
-->
<template>
  <div class="attr-rad-datetime">
    <el-form-item
      label="标签"
      size="mini"
    >
      <el-input
        clearable
        type="text"
        v-model="tempLabel"
      > </el-input>
    </el-form-item>
    <el-form-item label="时间选择器类型">
      <el-select
        v-model="tempDatetime"
        size="small"
      >
        <el-option
          v-for="item in typeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="格式">
      <el-select
        v-model="tempFormat"
        size="small"
        filterable
        allow-create
        default-first-option
      >
        <el-option
          v-for="item in formatList[tempDatetime]"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="尺寸">
      <el-radio
        size="small"
        v-model="tempSize"
        label="mini"
      >小</el-radio>
      <el-radio
        size="small"
        v-model="tempSize"
        label="small"
      >标准</el-radio>
      <el-radio
        size="small"
        v-model="tempSize"
        label="medium"
      >大</el-radio>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-datetime',
  props: {
    disabled: Boolean,
    size: String,
    datetime: String,
    format: String,
    label: String
  },
  data () {
    return {
      editable: true,
      tempSize: '',
      tempLabel: '',
      tempDatetime: 'date',
      typeList: [
        {
          value: 'year',
          label: '年'
        },
        {
          value: 'month',
          label: '年月'
        },
        {
          value: 'date',
          label: '年月日'
        },
        {
          value: 'week',
          label: 'x年x周'
        },
        {
          value: 'datetime',
          label: '年月日时间'
        },
        {
          value: 'datetimerange',
          label: '时间范围'
        },
        {
          value: 'daterange',
          label: '日期范围'
        }
      ],
      tempFormat: '',
      formatList: {
        date: [
          'yyyy-MM-dd',
          'yyyy-M-dd',
          'yyyy-MM-d',
          'yyyy-M-d',
          'yyyy/MM/dd',
          'yyyy/M/dd',
          'yyyy/MM/d',
          'yyyy/M/d'
        ],
        week: ['yyyy第W周'],
        year: ['yyyy'],
        month: ['yyyy-MM', 'yyyy-M', 'yyyy/M', 'yyyy/MM'],
        datetime: ['yyyy-MM-dd HH:mm:ss', 'yyyy/MM/dd HH:mm:ss'],
        datetimerange: ['yyyy-MM-dd HH:mm:ss', 'yyyy/MM/dd HH:mm:ss'],
        daterange: [
          'yyyy-MM-dd',
          'yyyy-M-dd',
          'yyyy-MM-d',
          'yyyy-M-d',
          'yyyy/MM/dd',
          'yyyy/M/dd',
          'yyyy/MM/d',
          'yyyy/M/d'
        ]
      }
    }
  },
  mounted () {
    this.editable = !this.disabled
    this.tempSize = this.size
    this.tempDatetime = this.datetime
    this.tempFormat = this.format || this.formatList.date[0]
    this.tempLabel = this.label
  },
  watch: {
    size (val) {
      this.tempSize = val
    },
    disabled (val) {
      this.editable = !val
    },
    datetime (val) {
      this.tempDatetime = val
    },
    tempSize (val) {
      this.$emit('update:size', val)
    },
    format (val) {
      this.tempFormat = val
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    },
    tempDatetime (val, oldVal) {
      if (val !== oldVal) {
        this.tempFormat = this.formatList[val][0]
      }
      this.$emit('update:datetime', val)
    },
    tempFormat (val) {
      this.$emit('update:format', val)
    },
    label (val) {
      this.tempLabel = val
    },
    tempLabel (val) {
      this.$emit('update:label', val)
    }
  }
}
</script>

<style lang="scss">
.el-input__inner,
.el-date-editor.el-input,
.el-date-editor.el-input__inner,
.el-range-editor .el-range-input {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: auto;
}
</style>
