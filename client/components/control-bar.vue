<template>
  <div class="components-contrl-bar">
    <el-tooltip class="item"
                effect="dark"
                content="撤销"
                placement="right">
      <div class="button-item"
           :class="{ disabled: !canUndo }"
           @click="editorUndo">
        <i class="icon iconfont iconundo"></i>
      </div>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                content="重做"
                placement="right">
      <div class="button-item"
           :class="{ disabled: !canRedo }"
           @click="editorRedo">
        <i class="icon iconfont iconredo"></i>
      </div>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                content="预览"
                placement="right">
      <div class="button-item"
           @click="showPreview">
        <i class="icon iconfont iconlscreen"></i>
      </div>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                :content="'放大 ' + parseFloat(scaleValue * 100).toFixed(0) + '%'"
                placement="right">
      <span class="button-item"
            @click="updateScale('plus')">
        <i class="icon iconfont iconplus"></i>
      </span>
    </el-tooltip>
    <el-tooltip class="item"
                effect="dark"
                :content="'缩小 ' + parseFloat(scaleValue * 100).toFixed(0) + '%'"
                placement="right">
      <span class="button-item"
            @click="updateScale('reduce')">
        <i class="icon iconfont icondelete"></i>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ControlBar',
  props: {
    // 是否loading
    loading: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      // 画板缩放
      scaleValue: 1
    }
  },
  computed: {
    ...mapGetters(['canUndo', 'canRedo'])
  },
  created () {
    this.scaleValue = this.scale
  },
  methods: {
    ...mapActions(['editorUndo', 'editorRedo']),
    /**
     * 更新画板大小
     */
    updateScale (type, value) {
      if (type === 'plus') {
        this.scaleValue =
          this.scaleValue + (value || 0.1) > 2
            ? 2
            : this.scaleValue + (value || 0.1)
      } else if (type === 'reduce') {
        this.scaleValue =
          this.scaleValue - (value || 0.1) > 0.5
            ? this.scaleValue - (value || 0.1)
            : 0.5
      } else if (type === 'reset') {
        this.scaleValue = value || 1
      }

      this.$emit('update:scale', this.scaleValue)
    },
    /**
     * 显示预览
     */
    showPreview () {
      this.$emit('showPreview')
    }
  }
}
</script>

<style lang="scss">
.components-contrl-bar {
  display: inline-block;
  z-index: 3;
  padding: 2px 12px;
  height: 30px;
  .button-item {
    display: inline-block;
    width: 38px;
    height: 38px;
    line-height: 38px;
    background: #e4e7ee;
    border-radius: 50%;
    box-shadow: 0px 2px 6px 0px #bdc5cd;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    font-size: 18px;
    transition: color 0.28s, transform 0.28s;
    user-select: none;
    margin-bottom: 24px;
    &.scale-wrappper {
      width: 110px;
      margin-right: 10px;
      &:hover {
        color: inherit;
        transform: none;
      }
      & > .scale-btn {
        display: inline-block;
        vertical-align: middle;
        padding: 6px 2px;
        font-size: 20px;
        transition: all 0.28s;
        &:hover {
          color: $primary;
        }
      }
    }
    &:hover {
      color: $primary;
      transform: scale(1.02);
      font-weight: bold;
    }
    &.disabled {
      cursor: not-allowed;
      color: $gray !important;
    }
    & > i {
      font-size: 18px;
      display: inline-block;
      transition: all 0.28s;
    }
    & > p {
      font-size: 14px;
    }
  }
}
</style>
