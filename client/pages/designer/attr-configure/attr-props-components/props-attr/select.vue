<template>
  <div class="attr-rad-select">
    <el-form-item label="选项">
      <el-input type="text"
                size="small"
                :rows="1"
                placeholder="英文逗号分隔"
                v-model="tempOptions">
      </el-input>
    </el-form-item>
    <el-form-item label="默认项">
      <el-select multiple
                 size="small"
                 v-model="tempSelect"
                 placeholder="请选择">
        <el-option v-for="(item, index) in tempOptions1"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="禁用项">
      <el-select multiple
                 size="small"
                 v-model="tempDisabledItems"
                 placeholder="请选择">
        <el-option v-for="(item, index) in tempOptions1"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="尺寸">
      <el-radio size="small"
                v-model="tempSize"
                label="mini">小</el-radio>
      <el-radio size="small"
                v-model="tempSize"
                label="small">标准</el-radio>
      <el-radio size="small"
                v-model="tempSize"
                label="medium">大</el-radio>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-select',
  props: {
    select: {
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    size: String,
    disabledItems: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tempOptions: '',
      editable: true,
      tempSize: '',
      tempOptions1: [],
      tempSelect: [],
      tempDisabledItems: []
    }
  },
  mounted() {
    this.tempOptions = (this.options && this.options.join(',')) || ''
    this.editable = !this.disabled
    this.tempSize = this.size
    this.tempSelect = this.select
    this.tempDisabledItems = this.tempDisabledItems
    this.tempOptions1 = this.options
  },
  watch: {
    size(val) {
      this.tempSize = val
    },
    disabledItems(val) {
      this.tempDisabledItems = val
    },
    options(val) {
      this.tempOptions = (val && val.join(',')) || ''
    },
    disabled(val) {
      this.tempDisabled = val
    },
    tempSize(val) {
      this.$emit('update:size', val)
    },
    tempOptions(val) {
      let list = val.split(',')
      this.tempOptions1 = []
      for (let value of list) {
        if (value) {
          this.tempOptions1.push(value)
        }
      }
      this.$emit('update:options', list)
    },
    editable(val) {
      this.$emit('update:disabled', !val)
    },
    tempDisabledItems(val) {
      this.$emit('update:disabledItems', val)
    },
    tempSelect(val) {
      this.$emit('update:select', val)
    }
  }
}
</script>

<style lang="scss">
.el-input__inner {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
}
</style>
