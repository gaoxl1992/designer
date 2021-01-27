<!--
 * @Description: 
 * @props: 
-->
<template>
  <div class="attr-rad-radio">
    <el-form-item label="选项">
      <el-input type="text"
                clearable
                size="small"
                :rows="1"
                placeholder="英文逗号分隔"
                v-model="tempOptions">
      </el-input>
    </el-form-item>
    <el-form-item label="默认项">
      <el-input-number v-model="tempIndex"
                       size="small"
                       :min="1"
                       :max="options.length"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-radio',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    radio: {
      type: Number,
      default: 1
    },
    disabled: Boolean
  },
  data () {
    return {
      tempOptions: '',
      tempIndex: 1,
      editable: true
    }
  },
  mounted () {
    this.tempIndex = this.radio
    this.tempOptions = this.options.join(',')
    this.editable = !this.disabled
  },
  watch: {
    radio (val) {
      this.tempIndex = val
    },
    options (val) {
      this.tempOptions = val.join(',')
    },
    disabled (val) {
      this.tempDisabled = val
    },
    tempIndex (val) {
      this.$emit('update:radio', val)
    },
    tempOptions (val, oldVal) {
      let temp = val.split(',')
      let oldTemp = oldVal.split(',')
      if (temp[this.tempIndex - 1] !== oldTemp[this.tempIndex - 1]) {
        this.tempIndex = 0
      }

      this.$emit('update:options', temp)
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    }
  }
}
</script>
