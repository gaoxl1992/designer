<template>
  <div class="attr-rad-drcode">
    <el-form-item label="类型">
      <el-switch
        v-model="codeTypeTemp"
        inactive-text="二维码"
        active-text="条形码"
      >
      </el-switch>
    </el-form-item>
    <el-form-item label="URL">
      <el-input
        type="textarea"
        clearable
        :rows="2"
        placeholder="请输入文本内容"
        v-model="tempDrcode"
      >
      </el-input>
      <div>示例：
        <div class="drcode-eg">https://www.baidu.com/s?wd={param1}&rsv_spt={param2}
        </div>
        param1，param2为业务中的key
      </div>
    </el-form-item>
    <el-form-item :label="(codeTypeTemp ? '条形码' : '二维码') +'颜色'">
      <el-color-picker
        size="mini"
        v-model="drcodeColorTemp"
      ></el-color-picker>
    </el-form-item>
    <el-form-item v-if="codeTypeTemp">
      <el-checkbox v-model="showNumTemp">展示条形码下方数字</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-drcode',
  props: {
    drcode: {
      type: String,
      default: ''
    },
    drcodeColor: {
      type: String,
      default: '#333333'
    },
    codeType: {
      type: Boolean,
      default: false
    },
    showNum: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tempDrcode: this.drcode,
      drcodeColorTemp: this.drcodeColor || '#333333',
      codeTypeTemp: this.codeType,
      showNumTemp: this.showNum
    }
  },
  mounted () {
    this.tempDrcode = this.drcode
    this.drcodeColorTemp = this.drcodeColor || '#333333'
    this.codeTypeTemp = this.codeType
    this.showNumTemp = this.showNum
  },
  watch: {
    drcode (val) {
      this.tempDrcode = val
    },
    drcodeColor (val) {
      this.drcodeColorTemp = val
    },
    codeType (val) {
      this.codeTypeTemp = val
    },
    showNum (val) {
      this.showNumTemp = val
    },
    tempDrcode (val) {
      this.$emit('update:drcode', val)
    },
    drcodeColorTemp (val) {
      this.$emit('update:drcodeColor', val)
    },
    codeTypeTemp (val) {
      this.$emit('update:codeType', val)
    },
    showNumTemp (val) {
      this.$emit('update:showNum', val)
    }
  }
}
</script>
<style lang="scss">
.drcode-eg {
  color: $primary;
}
</style>
