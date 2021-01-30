<!-- 左侧控件区 -->
<template>
  <div class="components-libs-wrapper scrollbar-wrapper">
    <ul class="scrollbar-wrapper">
      <div class="components-libs-title">
        <span>常用组件</span>
        <span class="op">
          <i
            v-if="!unableEdit"
            class="el-icon-setting"
            slot="reference"
            @click="dialogVisible = true"
          ></i>
          <i
            :class="{
                'el-icon-arrow-up': !openCusComps,
                'el-icon-arrow-down': openCusComps,
              }"
            @click="handleArrow"
          ></i>
        </span>
        <CusCompsSetting
          v-if="dialogVisible"
          :customComps="cusCompList"
          @close="dialogVisible = false"
        ></CusCompsSetting>
      </div>
      <template v-if="cusCompList && cusCompList.length">
        <li
          v-for="(item, index) in cusCompList"
          :key="index"
          class="clearfix"
          v-show="openCusComps"
        >
          <div
            class="cus-components-libs-title"
            v-if="item.components && item.components.length"
          >
            <p>{{ item.title }}</p>
          </div>
          <div v-if="item.components && item.components.length">
            <div
              class="cus-components-lib-item"
              v-for="(el, i) in item.components"
              :key="i"
              @click="handleClick(el)"
            >
              <p class="lib-item-title">{{ el.title }}</p>
            </div>
          </div>
        </li>
      </template>
      <el-divider></el-divider>
    </ul>
    <ul class="scrollbar-wrapper">
      <li
        v-for="(item, index) in componentsList"
        :key="index"
        class="clearfix paddingB30"
      >
        <div class="components-libs-title">
          <p>{{ item.title }}</p>
        </div>
        <div v-if="item.components && item.components.length">
          <div
            class="components-lib-item"
            v-for="(element, i) in item.components"
            :key="i"
            @click="handleClick(element)"
          >
            <p class="lib-item-title">{{ element.title }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { camelCase } from 'lodash'
import eleConfig from '@/config/ele-config'
import { _register_components_object } from '@/plugins/index'
import CusCompsSetting from './cus-coms-setting'

export default {
  name: 'ComponentLibs',
  props: {
    customComps: {
      type: Array,
      default: () => []
    },
    unableEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    CusCompsSetting
  },
  data () {
    return {
      componentsList: eleConfig,
      openCusComps: true,
      dialogVisible: false,
      cusCompList: () => []
    }
  },
  created () {
    this.cusCompList = JSON.parse(JSON.stringify(this.customComps))
  },
  watch: {
    customComps (val) {
      this.cusCompList = JSON.parse(JSON.stringify(val))
    }
  },
  methods: {
    handleArrow () {
      this.openCusComps = !this.openCusComps
    },
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick (item) {
      let props = this.getComponentProps(item.elName)
      this.$store.dispatch('addElement', { ...item, needProps: props })
    },
    /**
     * 根据elname获取组件默认props数据
     * @param elName
     */
    getComponentProps (elName) {
      let elComponentData
      for (let key in _register_components_object) {
        if (key.toLowerCase() === camelCase(elName).toLowerCase()) {
          elComponentData = _register_components_object[key]
          break
        }
      }
      if (!elComponentData) return {}

      let props = {}
      for (let key in elComponentData.props) {
        props[key] = [Object, Array].includes(elComponentData.props[key].type)
          ? elComponentData.props[key].default()
          : elComponentData.props[key].default
      }
      return props
    }
  }
}
</script>

<style lang="scss">
.components-libs-wrapper {
  user-select: none;
  height: 100%;
  position: relative;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #161616;
  overflow: auto;
  ul {
    padding: 20px;
  }
  .page-title {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
  }

  .components-libs-title {
    margin-bottom: 16px;
  }
  .cus-components-libs-title {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    padding-bottom: 4px;
  }
  .op {
    float: right;
    color: #707070;
    font-size: 14px;
    .el-icon-setting {
      padding-right: 20px;
      font-size: 12px;
    }
  }

  .components-lib-item,
  .cus-components-lib-item {
    color: #161616;
    text-align: center;
    background: transparent;
    width: calc(50% - 10px);
    float: left;
    border: 1px solid #cbced4;
    font-size: 12px;
    cursor: pointer;
    transition: All 0.3s ease-in-out;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    border-radius: 4px;
    background: #e4e7ee;
    font-weight: 400;
    &:hover {
      border: 1px solid #0a68b3;
      color: $primary;
    }
    .lib-item-title {
      font-size: 13px;
      font-weight: 400;
    }
  }
  .cus-components-lib-item {
    border: transparent;
    text-align: left;
    width: 30%;
    max-width: 33%;
    margin-bottom: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    p {
      display: inline;
    }
    &:hover {
      border: transparent;
      color: $primary;
    }
  }
  .el-divider--horizontal {
    margin: 0;
    margin-top: 16px;
  }
  .components-lib-item:nth-of-type(odd) {
    margin-right: 16px;
  }
  .scrollbar-wrapper ul {
    padding-top: 16px;
    padding-bottom: 0;
  }
}
</style>
