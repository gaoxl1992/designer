<template>
  <div class="components-contrl-bar">
    <el-tooltip
      class="item"
      effect="dark"
      content="撤销"
      placement="right"
      :open-delay="500"
    >
      <div
        class="button-item"
        :class="{ disabled: !canUndo }"
        @click="editorUndo"
      >
        <i class="icon iconfont iconundo"></i>
      </div>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="重做"
      placement="right"
      :open-delay="500"
    >
      <div
        class="button-item"
        :class="{ disabled: !canRedo }"
        @click="editorRedo"
      >
        <i class="icon iconfont iconredo"></i>
      </div>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="预览"
      placement="right"
      :open-delay="500"
    >
      <div
        class="button-item"
        @click="showPreview"
      >
        <i class="icon iconfont iconpreview"></i>
      </div>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      :content="fitScreenType === 0 ? '适应屏宽' : (fitScreenType === 1 ? '适应屏高' : '还原')"
      placement="right"
      :open-delay="500"
    >
      <span
        class="button-item"
        @click="fitScreen"
      >
        <i class="icon iconfont iconfit"></i>
      </span>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      :content="'放大 ' + parseFloat(scaleValue * 100).toFixed(0) + '%'"
      placement="right"
      :open-delay="500"
    >
      <span
        class="button-item"
        @click="updateScale('plus')"
      >
        <i class="icon iconfont iconplus"></i>
      </span>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      :content="'缩小 ' + parseFloat(scaleValue * 100).toFixed(0) + '%'"
      placement="right"
      :open-delay="500"
    >
      <span
        class="button-item"
        @click="updateScale('reduce')"
      >
        <i class="icon iconfont icondelete"></i>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
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
      scaleValue: this.scale,
      fitScreenType: 0
    }
  },
  inject: ['modelId'],
  computed: {
    canUndo () {
      return this.$store1.getters[this.modelId + '/canUndo']
    },
    canRedo () {
      return this.$store1.getters[this.modelId + '/canRedo']
    },
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
      }
    })
  },
  created () {
    this.scaleValue = this.scale
  },
  methods: {
    ...mapActions({
      editorUndo () {
        return {
          type: this.modelId + '/editorUndo'
        }
      },
      editorRedo () {
        return {
          type: this.modelId + 'editorRedo'
        }
      }
    }),
    /**
     * @description: 使用屏宽或屏高
     * @param {*}
     * @return {*}
     */
    fitScreen () {
      let el = document.getElementsByClassName('editor-main')[0]
      let width = window.innerWidth - 520
      let height = window.innerHeight - 50
      if (this.fitScreenType === 0) {
        this.scaleValue = width / this.pageData.width
        this.fitScreenType++
        this.$emit('update:scale', this.scaleValue)
        el.style.overflow = 'auto'
        el.style.height = '100%'
      } else if (this.fitScreenType === 1) {
        this.scaleValue = height / this.pageData.height
        this.fitScreenType++
        this.$emit('update:scale', this.scaleValue)
        el.style.overflow = 'hidden'
        el.style.height = height + 'px'
      } else {
        this.scaleValue = 1
        this.fitScreenType = 0
        this.$emit('update:scale', this.scaleValue)
        el.style.overflow = 'auto'
        el.style.height = '100%'
      }
    },
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
    background: $page-bg-color;
    border-radius: 50%;
    box-shadow: 0px 2px 6px 0px #bdc5cd;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
    font-size: 18px;
    transition: color 0.28s, transform 0.28s;
    user-select: none;
    margin-bottom: 24px;
    color: #434343;
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
    & > i {
      font-size: 18px;
      display: inline-block;
      transition: all 0.28s;
    }
    & > p {
      font-size: 14px;
    }
  }
  .disabled {
    cursor: not-allowed;
    color: $gray !important;
  }
  .icon {
    line-height: 18px;
  }
}
</style>
