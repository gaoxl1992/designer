<template>
  <div
    class="page-wrapper-menu-operation menu-item-on-edit-panel"
    :style="getMenuOptionsPositionStyle"
    :class="{ actived: activeElementUUID }"
  >
    <el-tooltip
      v-for="(item, index) in menuOptions"
      :key="index"
      effect="dark"
      :content="item.title"
      placement="right"
      :open-delay="100"
    >
      <div
        class="menu-item menu-item-on-edit-panel"
        @click="handleElementCommand(item.value)"
      >
        <i
          class="menu-item-on-edit-panel"
          :class="[item.icon]"
        ></i>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { menuOptions } from '@/config/attr-config'
export default {
  name: 'QuickOp',
  inject: ['modelId'],
  computed: {
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
      },
      activeElementsUUID () {
        let state = this.$store1.state[this.modelId];
        return state?.activeElementsUUID || []
      },
      activeElementUUID () {
        let state = this.$store1.state[this.modelId];
        return state?.activeElementUUID || ''
      }
    }),
    activeElementIndex () {
      return this.$store1.getters[this.modelId + '/activeElementIndex']
    },
    activeElement () {
      return this.$store1.getters[this.modelId + '/activeElement']
    },
    getMenuOptionsPositionStyle () {
      let both = (this.editorPaneWidth - this.pageData.width * this.scale) / 2
      let right = both < 60 ? 16 : both
      return {
        right: right + 'px'
      }
    }
  },
  data () {
    return {
      menuOptions
    }
  },
  methods: {
    /**
     * 对元素进行操作命令
     */
    handleElementCommand (command) {
      this.$store1.dispatch(this.modelId + '/elementCommand', command)
    }
  }
}
</script>
<style lang="scss">
.page-wrapper-menu-operation {
  position: fixed;
  right: 270px;
  top: 45px;
  width: 0;
  background: white;
  color: #333;
  text-align: center;
  z-index: 19;
  border-radius: 4px;
  display: none;
  transition: all 0.28s;
  opacity: 0;
  .menu-item {
    padding: 10px;
    cursor: pointer;
    .iconfont {
      font-size: 16px;
      line-height: 20px;
    }
    &:hover {
      background: $active-bg-color;
      color: $primary;
    }
  }
  &.actived {
    display: block;
    width: 45px;
    opacity: 1;
  }
}
</style>