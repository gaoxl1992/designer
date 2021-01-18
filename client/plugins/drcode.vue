<template>
  <div class="rad-drcode">
    <div class="rad-drcode-inner">
      <div class="drcode-placeholder">
        <i class="el-icon-full-screen"></i>
        <div class="drcode-placeholder-text">二维码/条形码</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadDrcode',
  props: {
    table: String
  }
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
