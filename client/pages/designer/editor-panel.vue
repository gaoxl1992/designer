<template>
  <div
    class="editor-pane"
    @click="handleClickCanvas"
    ref="editorPane"
  >
    <div class="editor-pane-inner">
      <div
        class="editor-pane-main"
        :style="{
          transform: 'scale(' + scale + ')',
          width: pageData.width + 'px',
          height: pageData.height + 'px',
          'background-image': pageData.backgroundImage,
          'background-size': pageData.backgroundSize + 'px',
        }"
        @mouseup="handMouseUp"
        @mousedown.left="onmousedownClick"
      >
        <div
          class="page-preview-wrapper"
          ref="canvas-panel"
          id="canvas-panel"
          :style="getCommonStyle(pageData.commonStyle)"
        >
          <!--页面组件列表展示-->
          <edit-shape
            v-for="item in pageData.elements"
            :key="item.uuid"
            :uuid="item.uuid"
            :defaultStyle="item.commonStyle"
            @handleElementClick="handleElementClick(item.uuid)"
            @resize="handleElementResize"
            :active="
              item.uuid === activeElementUUID ||
              activeElementsUUID.indexOf(item.uuid) > -1
            "
            :style="
              getCommonStyle({
                width: item.commonStyle.width,
                height: item.commonStyle.height,
                left: item.commonStyle.left,
                top: item.commonStyle.top,
                position: item.commonStyle.position,
              })
            "
          >
            <!-- 组件 -->
            <component
              class="element-on-edit-pane"
              :style="getCommonStyle({ ...item.commonStyle, top: 0, left: 0 })"
              :is="item.elName"
              :editorId="item.uuid"
              :id="item.uuid"
              pagetype="designer"
              v-bind="item.propsValue"
            />
          </edit-shape>
        </div>
        <!-- 多选区域 -->
        <div id="rectangular"></div>
        <!-- 页眉 -->
        <FixedArea pos="header"></FixedArea>
        <!-- 页脚 -->
        <FixedArea pos="footer"></FixedArea>
        <!-- <div class="page-wrapper-mask">
          <div
            class="page-de"
            :class="{ 'page-line': item !== 1 }"
            :style="{'height': (pageData.height / +pageData.totalPages) + 'px' }"
            v-for="item in +pageData.totalPages"
            :key="item"
          ></div>
        </div> -->
      </div>
      <!-- 快捷操作区 -->
      <QuickOp v-if="activeElementUUID && (!activeElementsUUID || !activeElementsUUID[0])"></QuickOp>
    </div>
  </div>
</template>
<script>
import { _register_components_object } from '@/plugins/index'
import editShape from '@/components/edit-shape'
import editorProjectConfig from '@/config/DataModel'
import { mapState, mapGetters } from 'vuex'
import FixedArea from '@/components/fixed-area'
import QuickOp from '@/components/quick-op'

export default {
  props: {
    // canvas画板缩放
    scale: {
      type: Number,
      default: 1
    }
  },
  components: {
    // 批量注册rad组件
    ..._register_components_object,
    // 画板组件
    [editShape.name]: editShape,
    FixedArea,
    QuickOp
  },
  data () {
    return {
      getCommonStyle: editorProjectConfig.getCommonStyle,
      editorPaneWidth: 0,
      paperDefaultHeight: 0,
      selectIdList: [],
      isRightClick: false,
      start_x: '',
      start_x_y: '',
      end_x: '',
      end_y: ''
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      activeElementsUUID: (state) => state.editor.activeElementsUUID
    }),
    ...mapGetters(['activeElementIndex', 'activeElement'])
  },
  mounted () {
    if (this.$refs.editorPane) {
      this.editorPaneWidth = this.$refs.editorPane.offsetHeight
    }
  },
  methods: {
    /**
     * 元素被点击
     * @param uuid
     */
    handleElementClick (uuid) {
      this.$store.dispatch('setActiveElementUUID', uuid)
    },
    /**
     * 移动改变元素大小定位
     * @param pos 当pos有值表示移动中需要实时同步样式变化，pos为undefind时则表示移动结束，记一次历史纪录
     * 鼠标移动完成时才记入历史纪录
     */
    handleElementResize (pos) {
      if (!pos) {
        this.$store.dispatch('addHistoryCache')
        return
      }
      this.pageData.elements[this.activeElementIndex].commonStyle.left =
        pos.left
      // 更新元素commonStyle
      this.pageData.elements[this.activeElementIndex].commonStyle = {
        ...pos
      }
    },
    /**
     * @description: 点击非控件
     * @param {*} e
     * @return {*}
     */
    handleClickCanvas (e) {
      if (!e.target || !e.target.classList) {
        return
      }
      if (
        !e.target.classList.contains('element-on-edit-pane') &&
        !e.target.classList.contains('menu-item-on-edit-panel')
      ) {
        this.$store.dispatch('setActiveElementUUID', '')
      }
    },
    /**
     * @description: 鼠标左键按下方法
     * @param {*} event
     * @return {*}
     */
    onmousedownClick (event) {
      this.isRightClick = true
      this.start_x = event.layerX
      this.start_y = event.layerY
      let that = this

      document.onmousemove = function (event) {
        let end_x = event.layerX
        let end_y = event.layerY
        let divElement = document.getElementById('rectangular')
        divElement.style.display = 'block'
        divElement.className = 'rectangular'
        //从左往右
        if (that.start_x < end_x) {
          divElement.style.width = end_x - that.start_x + 'px'
          divElement.style.height = Math.abs(that.start_y - end_y) + 'px'
          divElement.style.left = that.start_x + 'px'
          divElement.style.right = end_x + 'px'
          //从下往上
          if (that.start_y > end_y) {
            divElement.style.top = end_y + 'px'
            divElement.style.bottom = that.start_y + 'px'
          } else {
            divElement.style.top = that.start_y + 'px'
            divElement.style.bottom = end_y + 'px'
          }
        } else {
          divElement.style.width = that.start_x - end_x + 'px'
          divElement.style.height = Math.abs(that.start_y - end_y) + 'px'
          divElement.style.left = end_x + 'px'
          divElement.style.right = that.start_x + 'px'
          //从下往上
          if (that.start_y > end_y) {
            divElement.style.top = end_y + 'px'
            divElement.style.bottom = that.start_y + 'px'
          } else {
            divElement.style.top = that.start_y + 'px'
            divElement.style.bottom = 'px'
          }
        }
      }
      document.onmouseup = function () {
        //禁用鼠标移动时间
        document.onmousemove = function () {
          return false
        }
      }
    },
    handMouseUp (event) {
      this.end_x = event.layerX
      this.end_y = event.layerY

      let divElement = document.getElementById('rectangular')
      divElement.style.display = 'block'
      divElement.removeAttribute('class', 'rectangular')
      //核心内容，根据你的鼠标移动矩形区域来判断控件是否在里面
      this.isRightClick = false
      let elements = document.getElementsByClassName('components-edit-shape')
      let a = 0
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        console.log(element)
        let id = element.children[0].id
        let top = element.offsetTop //上边界
        let left = element.offsetLeft //左边界
        let right = left + element.offsetWidth //右边界
        let bottom = top + element.offsetHeight //下边界
        //原地点击
        if (this.start_x == this.end_x) {
          if (
            !(
              this.end_x >= left &&
              this.end_x <= right &&
              this.end_y > top &&
              this.end_y < bottom
            )
          ) {
            a += 1
          }
        } else {
          //从左往右
          if (this.start_x < this.end_x) {
            //从下到上
            if (this.start_y > this.end_y) {
              if (top < this.start_y && bottom > this.end_y) {
                if (left < this.end_x && right > this.start_x) {
                  if (this.selectIdList.indexOf(id) === -1) {
                    this.selectIdList.push(id)
                  }
                }
              }
            } else {
              // 从上到下
              if (top < this.end_y && bottom > this.start_y) {
                if (left < this.end_x && right > this.start_x) {
                  if (this.selectIdList.indexOf(id) === -1) {
                    this.selectIdList.push(id)
                  }
                }
              }
            }
            //从右往左
          } else {
            //从下到上
            if (this.start_y > this.end_y) {
              if (top < this.start_y && bottom > this.end_y) {
                if (left < this.start_x && right > this.end_x) {
                  if (this.selectIdList.indexOf(id) === -1) {
                    this.selectIdList.push(id)
                  }
                }
              }
            } else {
              if (top < this.end_y && bottom > this.start_y) {
                if (left < this.start_x && right > this.end_x) {
                  if (this.selectIdList.indexOf(id) === -1) {
                    this.selectIdList.push(id)
                  }
                }
              }
            }
          }
        }
      }
      //如果点击空白处
      if (a == elements.length) {
        this.selectIdList = []
      }
      this.$store.dispatch('setActiveElementsUUID', this.selectIdList)
    }
  }
}
</script>

<style lang="scss">
.editor-pane {
  overflow: auto;
  height: 100%;
  width: 100%;
  border: 1px solid $white;
  border-width: 0 1px;
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
  background-color: $page-bg-deepcolor;
  .rectangular {
    background-color: rgba(235, 239, 243, 0.45);
    position: fixed;
    border: 1px solid $border-color;
    z-index: 1001;
  }
  .editor-pane-inner {
    width: 100%;
    overflow: auto;
    margin: 0 auto;
    margin-bottom: 50px;
  }
  .editor-pane-main {
    overflow: hidden !important;
    border-radius: 3px;
    box-shadow: 0 3px 10px #dae1ed;
    border: 1px dashed #0a68b3;
    margin: 20px auto;
    position: relative;
    background: $page-bg-color;
    transform-origin: center top;
    min-width: 700px;
  }
  .page-preview-wrapper {
    height: 100%;
    position: relative;
    margin: 10px;
    pointer-events: inherit;
  }
  .page-wrapper-mask {
    height: 100%;
    width: 100%;
    z-index: 1000;
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    .page-de {
      flex: 1;
    }
    .page-line {
      flex: 1;
      border-top: 1px dashed #0a68b3;
    }
  }
  .element-on-edit-pane {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
}
</style>
