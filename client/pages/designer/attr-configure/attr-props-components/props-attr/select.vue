<template>
  <div class="attr-rad-select">
    <SetSelOption
      class="select-option"
      @chgSetOption="chgSetOption"
      selTypeParent="multiply"
      :supportType="['multiply']"
      :moreop="['disabledOption']"
      :optionsParent="tempSelect">
    </SetSelOption>
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
import SetSelOption from '@/components/SetSelOption.vue'
export default {
  name: 'attr-rad-select',
  components: {
    SetSelOption
  },
  props: {
    select: {
      type: Array,
      default: () => []
    },
    disabled: Boolean,
    size: String
  },
  data () {
    return {
      editable: true,
      tempSize: '',
      tempSelect: []
    }
  },
  mounted () {
    this.editable = !this.disabled
    this.tempSize = this.size
    this.tempSelect = this.select
  },
  methods: {
    chgSetOption (e) {
      if (!e.options) {
        return
      }
      this.tempSelect = JSON.parse(JSON.stringify(e.options))
      let list = []
      this.tempSelect.forEach((item) => {
        if (item.defaultFlag) {
          list.push(item.value)
        }
      })
      this.$emit('update:defaultChecked', list)
    }
  },
  watch: {
    size (val) {
      this.tempSize = val
    },
    disabled (val) {
      this.tempDisabled = val
      this.editable = !val
    },
    tempSize (val) {
      this.$emit('update:size', val)
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    },
    tempSelect: {
      handler (val) {
        this.$emit('update:select', val)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
.el-input__inner {
  color: inherit;
  font-size: inherit;
  font-weight: inherit;
  .select-option {
    margin-bottom: 20px;
  }
}
</style>
