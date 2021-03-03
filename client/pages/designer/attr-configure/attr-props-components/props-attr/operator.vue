<template>
  <div class="attr-rad-operator">
    <el-form-item
      label="默认值"
      size="mini"
    >
      <el-input
        clearable
        type="text"
        v-model="tempInput"
      > </el-input>
    </el-form-item>
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
    <el-form-item
      label="占位"
      size="mini"
    >
      <el-input
        clearable
        type="text"
        v-model="tempPlaceholder"
      > </el-input>
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
      <el-checkbox v-model="openSignTemp">手写体签名</el-checkbox>
    </el-form-item>
    <el-form-item
      v-if="openSignTemp"
      label="宽高"
      class="sign-w-h"
    >
      <el-input-number
        size="mini"
        v-model="signWidthTemp"
        controls-position="right"
        label="宽度"
        :min="0"
      />
      <el-input-number
        size="mini"
        v-model="signHeightTemp"
        controls-position="right"
        label="高度"
        :min="0"
      />
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="editable">可编辑</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-operator',
  props: {
    operator: String,
    label: String,
    placeholder: String,
    size: String,
    disabled: Boolean,
    openSign: Boolean,
    signWidth: {
      type: Number,
      default: 80
    },
    signHeight: {
      type: Number,
      default: 40
    }
  },
  data () {
    return {
      tempInput: '',
      tempLabel: '',
      tempPlaceholder: '',
      tempSize: '',
      editable: true,
      openSignTemp: true,
      signWidthTemp: 80,
      signHeightTemp: 40
    }
  },
  mounted () {
    this.tempInput = this.operator
    this.tempLabel = this.label
    this.tempPlaceholder = this.placeholder
    this.tempSize = this.size
    this.editable = !this.disabled
    this.openSignTemp = this.openSign
    this.signWidthTemp = this.signWidth
    this.signHeightTemp = this.signHeight
  },
  watch: {
    signWidth (val) {
      this.signWidthTemp = val
    },
    signHeight (val) {
      this.signHeightTemp = val
    },
    operator (val) {
      this.tempInput = val
    },
    label (val) {
      this.tempLabel = val
    },
    placeholder (val) {
      this.tempPlaceholder = val
    },
    size (val) {
      this.tempSize = val
    },
    disabled (val) {
      this.editable = !val
    },
    openSign (val) {
      this.openSignTemp = val
    },
    signWidthTemp (val) {
      this.$emit('update:signWidth', val)
    },
    signHeightTemp (val) {
      this.$emit('update:signHeight', val)
    },
    openSignTemp (val) {
      this.$emit('update:openSign', val)
    },
    tempInput (val) {
      this.$emit('update:operator', val)
    },
    tempLabel (val) {
      this.$emit('update:label', val)
    },
    tempPlaceholder (val) {
      this.$emit('update:placeholder', val)
    },
    tempSize (val) {
      this.$emit('update:size', val)
    },
    editable (val) {
      this.$emit('update:disabled', !val)
    }
  }
}
</script>

<style lang="scss">
.el-form-item {
  margin-bottom: 10px;
}
.sign-w-h {
  .el-input-number--mini {
    width: 90px !important;
    margin-right: 5px;
  }
}
</style>
