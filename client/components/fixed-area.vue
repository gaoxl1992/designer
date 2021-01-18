<template>
  <div :class="'fixed-' + pos"
       :style="{ height: pageData[pos === 'header' ? 'fixedHeader' : 'fixedFooter'].height + 'px' }"
       v-if="pageData[pos === 'header' ? 'fixedHeader' : 'fixedFooter'].openFixed">
    <div :class="'edit-shape-point-' + pos"
         @mousedown="handleMouseDownOnPoint"> </div>
    <div :class="'fixed-tip-' + pos">{{pos==='header' ? '头部': '底部'}}固定区域，编辑时不可见，打印可见</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'FixedArea',
  props: {
    pos: {
      type: String,
      default: 'header'
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData
    })
  },
  methods: {
    /**
     * 鼠标点击可以的按钮resize事件
     * @param point
     * @param downEvent
     */
    handleMouseDownOnPoint() {
      let downEvent = event
      downEvent.stopPropagation()
      downEvent.preventDefault()
      let height =
        this.pos === 'header'
          ? this.pageData.fixedHeader.height
          : this.pageData.fixedFooter.height

      let startY = downEvent.clientY
      let move = (moveEvent) => {
        let currY = moveEvent.clientY
        let disY = currY - startY
        let newHeight = +height + (this.pos === 'header' ? disY : -disY)
        if (this.pos === 'header') {
          this.pageData.fixedHeader.height = newHeight > 0 ? newHeight : 0
        } else {
          this.pageData.fixedFooter.height = newHeight > 0 ? newHeight : 0
        }
      }
      let up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    }
  }
}
</script>
<style lang="scss">
.edit-shape-point-footer,
.edit-shape-point-header {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  border-radius: 10px;
  position: absolute;
  left: calc(50% - 5px);
  z-index: 1001;
  cursor: move;
  &.active {
    outline: 1px dashed #25a589;
  }
  &:hover {
    outline: 1px dashed #25a589;
  }
}
.edit-shape-point-header {
  bottom: -5px;
  cursor: s-resize;
}
.edit-shape-point-footer {
  top: -5px;
  cursor: n-resize;
}
.fixed-header,
.fixed-footer {
  position: absolute;
  width: 100%;
  height: 50px;
  min-height: 20px;
  left: 0;
  border: 1px solid #59c7f9;
}

.fixed-header {
  top: 0;
}
.fixed-footer {
  bottom: 0;
}
.fixed-tip-header,
.fixed-tip-footer {
  border-radius: 10px;
  position: absolute;
  font-size: 10px;
  z-index: 1000;
  left: calc(50% + 10px);
  background-color: #e4e7ee;
  padding: 0 5px;
  opacity: 0.8;
  color: #59c7f9;
}
.fixed-tip-header {
  bottom: -6px;
}
.fixed-tip-footer {
  top: -6px;
}
</style>