<template>
  <div class="rad-drcode">
    <div
      class="rad-drcode-inner"
      v-if="pagetype === 'designer'"
    >
      <div class="drcode-placeholder">
        <i class="el-icon-full-screen"></i>
        <div class="drcode-placeholder-text">二维码/条形码</div>
      </div>
    </div>
    <div
      v-else-if="drcodeTemp"
      style="height:100%;widht:100%"
    >
      <vue-qr
        v-if="!codeType"
        style="height:100%;widht:100%"
        :logoScale="20"
        :text="drcodeTemp"
        :colorDark="drcodeColor"
        colorLight="#fff"
        :margin="0"
        :dotScale="1"
        ref="qr"
      ></vue-qr>
      <img
        v-else
        id="barcode"
        alt=""
        style="height:100%;widht:100%"
      />
    </div>
  </div>
</template>

<script>
import vueQr from 'vue-qr'
import { getBracketStr } from '@/utils/mUtils'
import jsbarcode from 'jsbarcode'
export default {
  name: 'RadDrcode',
  props: {
    drcode: {
      type: String,
      default: ''
    },
    pagetype: {
      type: String,
      default: ''
    },
    drcodeColor: {
      type: String,
      default: '#333'
    },
    element: {
      type: Object,
      default: () => { }
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
  inject: ['modelId'],
  data () {
    return {
      drcodeTemp: getBracketStr(this.drcode, this.modelId)
    }
  },
  components: {
    vueQr
  },
  mounted () {
    if (this.pagetype !== 'designer' && this.codeType && this.drcodeTemp) {
      jsbarcode(
        '#barcode',
        this.drcodeTemp,
        {
          displayValue: this.showNum,
          lineColor: this.drcodeColor
        }
      )
    }
  },
}
</script>
<style lang="scss">
.rad-drcode {
  height: 100%;
  width: 100%;
  .rad-drcode-inner {
    border: 1px solid #adb1b8;
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-weight: 400;
    color: #000;
    text-align: center;
    .drcode-placeholder {
      position: absolute;
      top: calc(50% - 30px);
      left: calc(50% - 65px);
      vertical-align: baseline;
      display: inline-block;
    }
    .el-icon-full-screen {
      font-size: 30px;
    }
  }
}
</style>
