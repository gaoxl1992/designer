<template>
  <div class="attr-rad-checkbox">
    <el-form-item label="选项">
      <el-input type="text"
                :rows="1"
                placeholder="英文逗号分隔"
                v-model="tempOptions">
      </el-input>
    </el-form-item>
    <el-form-item label="默认项">
      <el-select v-model="tempCheckbox"
                 multiple
                 placeholder="无默认项">
        <el-option v-for="(item, index) in tempOptions1"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="禁用项">
      <el-select v-model="tempDisabled"
                 multiple
                 placeholder="无禁用项">
        <el-option v-for="(item, index) in tempOptions1"
                   :key="index"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-checkbox',
  props: {
    disabled: Boolean,
    checkbox: {
      type: Array,
      default: () => []
    },
    disabeldList: {
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
      tempCheckbox: [],
      tempDisabled: [],
      tempOptions1: []
    }
  },
  mounted() {
    this.tempOptions = this.options.join(',')
    this.editable = !this.disabled
    this.tempCheckbox = this.checkbox
    this.tempDisabled = this.disabeldList
  },
  watch: {
    checkbox(val) {
      this.tempCheckbox = val
    },
    options(val) {
      this.tempOptions = val.join(',')
    },
    disabeldList(val) {
      this.tempDisabled = val
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
    tempCheckbox(val) {
      this.$emit('update:checkbox', val)
    },
    tempDisabled(val) {
      this.$emit('update:disabledItems', val)
    },
    editable(val) {
      this.$emit('update:disabled', !val)
    }
  }
}
</script>
