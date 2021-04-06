<template>
  <div class="rad-select">
    <el-select v-if="pagetype !== 'preview'"
               :class="'rad-select-' + pagetype"
               multiple
               v-model="tempSelect"
               placeholder="请选择"
               :size="size"
               :collapse-tags="true"
               :disabled="disabledValue || pagetype==='designer'">
      <el-option v-for="(option, index) in options"
                 :key="index"
                 :label="option.value"
                 :disabled="option.disabled"
                 :value="option.value">
      </el-option>
    </el-select>
    <div v-else>
      <span class="select-item">{{ tempSelect.join('，') }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadSelect',
  props: {
    size: { // 大小
      type: String,
      default: 'small'
    },
    disabled: { // 禁用
      type: Boolean,
      default: false
    },
    select: { // 全部选项
      type: Array,
      default: () => []
    },
    pagetype: String,
    element: {
      type: Object,
      default: () => {}
    },
    defaultChecked: { // 默认选中项
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      disabledValue: this.disabled,
      tempSelect: this.defaultChecked,
      options: this.select
    }
  },
  mounted () {
    if (this.element?.value) {
      this.tempSelect = this.element.value
    }
  },
  watch: {
    disabled(val) {
      this.disabledValue = val
    },
    select(val) {
      this.options = val
    },
    defaultChecked (val) {
      this.tempSelect = val
    },
    tempSelect(val) {
      this.$emit('update:value', val)
    }
  }
}
</script>
<style lang="scss">
.rad-select {
  .select-item {
    padding-right: 5px;
  }
}
</style>