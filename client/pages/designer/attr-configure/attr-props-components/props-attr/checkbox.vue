<template>
  <div class="attr-rad-checkbox">
    <SetSelOption
      class="checkbox"
      @chgSetOption="chgSetOption"
      selTypeParent="multiply"
      :supportType="['multiply']"
      :optionsParent="tempOptions">
    </SetSelOption>
    <el-form-item>
      <el-checkbox v-model="editable"
                   size="small">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
import SetSelOption from '@/components/SetSelOption.vue'
export default {
  name: 'attr-rad-checkbox',
  components: {
    SetSelOption
  },
  props: {
    disabled: Boolean,
    checkbox: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tempOptions: [],
      editable: true
    }
  },
  mounted () {
    this.tempOptions = JSON.parse(JSON.stringify(this.checkbox))
    this.editable = !this.disabled
  },
  methods: {
    chgSetOption (e) {
      if (!e.options) {
        return
      }
      this.tempOptions = JSON.parse(JSON.stringify(e.options))
      let list = []
      this.tempOptions.forEach((item) => {
        if (item.defaultFlag) {
          list.push(item.value)
        }
      })
      this.$emit('update:defaultChecked', list)
    }
  },
  watch: {
    tempOptions: {
      handler (val) {
        this.$emit('update:checkbox', val)
      },
      deep: true,
      immediate: true
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    }
  }
}
</script>
