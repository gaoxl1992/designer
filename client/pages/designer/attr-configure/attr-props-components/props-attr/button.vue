<template>
  <div class="attr-rad-button">
    <el-form-item label="文字">
      <el-input size="small"
                clearable
                type="text"
                placeholder="请输出按钮的文案"
                v-model="tempButton">
      </el-input>
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
      <el-checkbox v-model="tempPlain">朴素按钮</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="tempRound">圆角按钮</el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="tempCircle">icon按钮</el-checkbox>
      <el-input size="small"
                clearable
                type="text"
                placeholder="请输出icon类名"
                v-model="tempIcon"></el-input>
    </el-form-item>
    <el-form-item label="按钮类型">
      <el-select v-model="tempType"
                 size="small">
        <el-option v-for="item in options"
                   :key="item"
                   :label="item"
                   :value="item">
        </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-button',
  props: {
    button: String,
    size: String,
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    icon: String,
    type: String
  },
  data () {
    return {
      tempButton: '',
      tempSize: '',
      tempPlain: false,
      tempRound: false,
      tempCircle: false,
      tempIcon: '',
      tempType: 'primary',
      options: ['primary', 'success', 'info', 'warning', 'danger']
    }
  },
  mounted () {
    this.tempButton = this.button
    this.tempSize = this.size
    this.tempPlain = this.plain
    this.tempRound = this.round
    this.tempCircle = this.circle
    this.tempIcon = this.icon
    this.tempType = this.type
  },
  inject: ['modelId'],
  watch: {
    button (val) {
      this.tempButton = val
    },
    size (val) {
      this.tempSize = val
    },
    plain (val) {
      this.tempPlain = val
    },
    round (val) {
      this.tempRound = val
    },
    circle (val) {
      this.tempCircle = val
    },
    icon (val) {
      this.tempIcon = val
    },
    type (val) {
      this.tempType = val
    },
    tempButton (val) {
      this.$emit('update:button', val)
    },
    tempSize (val) {
      this.$emit('update:size', val)
    },
    tempPlain (val) {
      this.$emit('update:plain', val)
    },
    tempRound (val) {
      this.$emit('update:round', val)
    },
    tempCircle (val) {
      this.$emit('update:circle', val)
    },
    tempIcon (val) {
      this.$emit('update:icon', val)
    },
    tempType (val) {
      this.$emit('update:type', val)
      this.$store1.dispatch(this.modelId + '/addHistoryCache')
    }
  }
}
</script>