<template>
  <div class="attr-rad-imagepicker">
    <el-form-item label="最大上传图片数">
      <el-input-number
        v-model="maxPicsNum"
        :min="1"
        size="small"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="每行最多图片数">
      <el-input-number
        v-model="maxLinePics"
        :min="1"
        size="small"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="图片间距">
      <el-input-number
        v-model="picDisTemp"
        :min="5"
        :max="50"
        size="small"
      ></el-input-number>
      px
    </el-form-item>
    <el-form-item label="行间距">
      <el-input-number
        v-model="rowDisTemp"
        :min="2"
        size="small"
      ></el-input-number>
      px
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-imagepicker',
  props: {
    imagepicker: {
      type: Number,
      default: 1
    },
    linepics: {
      type: Number,
      default: 1
    },
    picDis: {
      type: Number,
      default: 2
    },
    rowHeight: {
      type: Number,
      default: 200
    },
    rowDis: {
      type: Number,
      default: 2
    },
    fixType: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      maxPicsNum: this.imagepicker || 1,
      maxLinePics: this.linepics || 1,
      picDisTemp: this.picDis || 5,
      rowHeightTemp: this.rowHeight || 200,
      rowDisTemp: this.rowDis || 2,
      fixTypeTemp: this.fixType || 3
    }
  },
  mounted () {
    this.maxPicsNum = this.imagepicker || 1
    this.maxLinePics = this.linepics || 1
    this.picDisTemp = this.picDis || 5
    this.rowHeightTemp = this.rowHeight || 200
    this.rowDisTemp = this.rowDis || 2
    this.fixTypeTemp = this.fixType || 3
  },
  computed: {
    activeElement () {
      return this.$store1.getters[this.modelId + '/activeElement']
    }
  },
  watch: {
    picDisTemp (val) {
      this.$emit('update:picDis', val)
    },
    rowHeightTemp (val) {
      this.activeElement.commonStyle.height = val
      this.$emit('update:rowHeight', val)
    },
    rowDisTemp (val) {
      this.$emit('update:rowDis', val)
    },
    fixTypeTemp (val) {
      this.$emit('update:fixType', val)
    },
    maxPicsNum (val) {
      this.$emit('update:imagepicker', val)
    },
    maxLinePics (val) {
      this.$emit('update:linepics', val)
    },
    picDis (val) {
      this.picDisTemp = val
    },
    rowHeight (val) {
      this.rowHeightTemp = val
    },
    rowDis (val) {
      this.rowDisTemp = val
    },
    imagepicker (val) {
      this.maxPicsNum = val
    },
    linepics (val) {
      this.maxLinePics = val
    },
    fixType (val) {
      this.fixTypeTemp = val
    }
  }
}
</script>
<style lang="scss">
.pics-not-full {
  .el-radio {
    margin-bottom: 10px;
  }
}
</style>