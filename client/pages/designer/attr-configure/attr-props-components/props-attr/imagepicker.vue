<template>
  <div class="attr-rad-imagepicker">
    <el-form-item label="最大上传图片数">
      <el-input-number v-model="maxPicsNum"
                       :min="1"
                       size="small"></el-input-number>
    </el-form-item>
    <el-form-item label="每行最多图片数">
      <el-input-number v-model="maxLinePics"
                       :min="1"
                       size="small"></el-input-number>
    </el-form-item>
    <el-form-item label="图片间距">
      <el-input-number v-model="picDisTemp"
                       :min="2"
                       :max="50"
                       size="small"></el-input-number>
      px
    </el-form-item>
    <el-form-item label="行间距">
      <el-input-number v-model="rowDisTemp"
                       :min="2"
                       size="small"></el-input-number>
      px
    </el-form-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'attr-rad-imagepicker',
  props: {
    imagepicker: Number,
    linepics: Number,
    picDis: Number,
    rowHeight: Number,
    rowDis: Number
  },
  data() {
    return {
      maxPicsNum: 1,
      maxLinePics: 1,
      picDisTemp: 2,
      rowHeightTemp: 200,
      rowDisTemp: 2
    }
  },
  mounted() {
    this.maxPicsNum = this.imagepicker || 1
    this.maxLinePics = this.linepics || 1
    this.picDisTemp = this.picDis || 2
    this.rowHeightTemp = this.rowHeight || 200
    this.rowDisTemp = this.rowDis || 2
  },
  computed: {
    ...mapGetters(['activeElement'])
  },
  watch: {
    picDisTemp(val) {
      this.$emit('update:picDis', val)
    },
    rowHeightTemp(val) {
      this.activeElement.commonStyle.height = val
      this.$emit('update:rowHeight', val)
    },
    rowDisTemp(val) {
      this.$emit('update:rowDis', val)
    },
    maxPicsNum(val) {
      this.$emit('update:imagepicker', val)
    },
    maxLinePics(val) {
      this.$emit('update:linepics', val)
    },
    picDis(val) {
      this.picDisTemp = val
    },
    rowHeight(val) {
      this.rowHeightTemp = val
    },
    rowDis(val) {
      this.rowDisTemp = val
    },
    imagepicker(val) {
      this.maxPicsNum = val
    },
    linepics(val) {
      this.maxLinePics = val
    }
  }
}
</script>