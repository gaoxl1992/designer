<template>
  <div class="attr-rad-radio">
    <SetSelOption class="radio" @chgSetOption="chgSetOption" :supportType="['single']" selTypeParent="single" :optionsParent="tempOptions"></SetSelOption>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
import SetSelOption from '@/components/SetSelOption.vue'
export default {
  name: 'attr-rad-radio',
  components: {
    SetSelOption
  },
  props: {
    radio: {
      type: Array,
      default: () => []
    },
    disabled: Boolean
  },
  data () {
    return {
      tempOptions: [],
      editable: true
    }
  },
  mounted () {
    this.tempOptions = JSON.parse(JSON.stringify(this.radio))
    this.editable = !this.disabled
  },
  methods: {
    chgSetOption (e) {
      if (!e.options) {
        return
      }
      this.tempOptions = JSON.parse(JSON.stringify(e.options))
      this.tempOptions.forEach((item) => {
        if (item.defaultFlag) {
          this.$emit('update:defaultChecked', item.value)
        }
      })
    }
  },
  watch: {
    disabled (val) {
      this.tempDisabled = val
      this.editable = !val
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    },
    tempOptions: {
      handler (val) {
        this.$emit('update:radio', val)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss">
.attr-rad-radio {
  .options {
    margin-bottom: 20px;
  }
}
</style>