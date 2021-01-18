<!--
 * @Description: 按钮插件
 * @props: button size plain round circle icon type
-->
<template>
  <div class="rad-button">
    <el-button :size="tempSize"
               :plain="tempPlain"
               :round="tempRound"
               :circle="tempCircle"
               :icon="tempIcon"
               :type="tempType">
      <span v-if="!tempCircle">{{ button }}</span>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'RadButton', // 这个名字很重要，它就是未来的标签名
  props: {
    button: {
      type: String,
      default: '按 钮'
    },
    size: {
      type: String,
      default: 'small'
    },
    plain: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      tempSize: this.size,
      tempPlain: this.plain,
      tempRound: this.round,
      tempCircle: this.circle,
      tempIcon: this.icon,
      tempType: this.type
    }
  },
  watch: {
    size(val) {
      this.tempSize = val
    },
    plain(val) {
      this.tempPlain = val
    },
    round(val) {
      this.tempRound = val
    },
    circle(val) {
      this.tempCircle = val
    },
    icon(val) {
      this.tempIcon = val
    },
    type(val) {
      this.tempType = val
    }
  }
}
</script>

<style lang="scss">
.rad-button {
  text-align: center;
  .el-button--mini {
    padding: 7px 15px !important;
  }
  .el-button--small {
    padding: 9px 15px !important;
  }
  .el-button--medium {
    padding: 10px 20px !important;
  }
  .el-button.is-circle {
    border-radius: 50%;
    padding: 12px !important;
  }
}
</style>
