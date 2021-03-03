<template>
  <div class="rad-select">
    <el-select v-if="pagetype !== 'preview'"
               :class="'rad-select-' + pagetype"
               multiple
               v-model="tempSelect"
               placeholder="请选择"
               :size="size"
               :disabled="disabledValue || pagetype==='designer'">
      <el-option v-for="(option, index) in options"
                 :key="index"
                 :label="option"
                 :value="option"
                 :disabled="tempDisabledItems.includes(option)">
      </el-option>
    </el-select>
    <div v-else>
      <span class="select-item"
            v-for="(option, index) in tempSelect"
            :key="index">{{option}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadSelect',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'small'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    select: {
      type: Array,
      default: () => []
    },
    disabledItems: {
      type: Array,
      default: () => []
    },
    pagetype: String,
    element: {
      type: Object,
      default: () => {}
    }
  },
  created() {
    this.tempSelect = (this.element && this.element.value) || []
  },
  data() {
    return {
      disabledValue: this.disabled,
      tempSelect: this.select,
      tempDisabledItems: this.disabledItems
    }
  },
  watch: {
    'element.value' (val) {
      this.tempSelect = val
    },
    disabled(val) {
      this.disabledValue = val
    },
    select(val) {
      this.tempSelect = val
    },
    disabledItems(val) {
      this.tempDisabledItems = val
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