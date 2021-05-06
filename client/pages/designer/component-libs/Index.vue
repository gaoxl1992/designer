<!-- 左侧控件区 -->
<template>
  <div class="components-libs">
    <ul class="components-lib-cus">
      <div class="components-lib-cus-title">
        <span>常用组件</span>
        <span class="op">
          <i
            class="el-icon-setting cursor-pointer"
            slot="reference"
            @click="dialogVisible = true"
          ></i>
          <i
            :class="{ 'el-icon-arrow-up': !openCusComps, 'el-icon-arrow-down': openCusComps,}"
            class="cursor-pointer"
            @click="handleArrow"
          ></i>
        </span>
        <CusCompsSetting
          v-if="dialogVisible"
          :dialogVisible="dialogVisible"
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
          <template v-if="showCat(item.domains)">
            <p class="cus-components-libs-title">{{ item.category }}</p>
            <template v-for="(el, i) in item.domains">
              <div
                v-if="!el.hidden"
                class="cus-components-lib-item"
                :key="i"
                @click="handleCusClick(el)"
              >
                <el-tooltip class="item" effect="dark" :content="el.name" placement="top" :open-delay="+500">
                  <p class="lib-item-title">{{ el.name }}</p>
                </el-tooltip>
              </div>
            </template>
          </template>
        </li>
      </template>
    </ul>
    <div class="components-lib-base">
      <div
        v-for="(item, index) in componentsList"
        :key="index"
      >
        <p class="components-libs-title">{{ item.title }}</p>
        <div v-if="item.components && item.components.length" class="base-components-libs-wrapper">
          <div
            class="components-lib-item"
            v-for="(element, i) in item.components"
            :key="i"
            @click="handleClick(element)"
          >
            <p class="lib-item-title">{{ element.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { camelCase } from 'lodash'
import { eleConfig, eleMap } from '@/config/ele-config'
import { _register_components_object } from '@/plugins/index'
import CusCompsSetting from './cus-coms-setting'
import bus from '@/utils/bus'

export default {
  name: 'ComponentLibs',
  props: {
    customComps: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CusCompsSetting
  },
  inject: ['modelId'],
  data () {
    return {
      componentsList: eleConfig,
      openCusComps: true,
      dialogVisible: false,
      cusCompList: () => [],
      moreHeight: ['rad-image', 'rad-imagepicker', 'rad-drcode', 'rad-editor', 'rad-rectangle']
    }
  },
  computed: {
    showCat() {
      return function (domains) {
        let show = false
        for (let i = 0; i < domains.length; i++) {
          if (!domains[i].hidden) {
            show = true
            break
          }
        }
        return show
      }
    }
  },
  created () {
    this.cusCompList = JSON.parse(JSON.stringify(this.customComps))
    bus.$on('saveCustomNotDisplayComps', (comps) => {
      this.cusCompList.forEach((cats) => {
        cats.domains.forEach((cusComp) => {
          if (comps && comps.indexOf(cusComp.option) !== -1) {
            cusComp.hidden = true
          } else {
            cusComp.hidden = false
          }
        })
      })
    })
  },
  methods: {
    /**
     * @description: 尖角状态
     * @param {*}
     * @return {*}
     */
    handleArrow () {
      this.openCusComps = !this.openCusComps
    },
    /**
     * @description: 处理客户自定义组合式组件
     * @param {*} item
     * @return {*}
     */
    handleCusClick (item) {
      let defaultStyle = {}
      if (item.types.length === 1) {
        defaultStyle = {
          height: this.moreHeight.indexOf(item.types[0]) > -1 ? 260 : 40
        }
      } else {
        defaultStyle = {
          height: 40,
          width: 170
        }
      }
      for (let i = 0; i < item.types.length; i++) {
        let left = 0
        let oneEle = item.types.length === 1
        let props = this.getComponentProps(item.types[i])
        this.$store1.dispatch(this.modelId + '/addElement', {
          elName: item.types[i],
          title: eleMap[item.types[i]],
          threshold: item.option,
          defaultStyle: {
            left: oneEle || i === 0 ? 0 : left + 170 + 10,
            ...defaultStyle
          },
          needProps: {
            ...props,
            label: item.name
          }
        })
      }
    },
    /**
     * 点击事件, 向父组件派发add-element事件，参数： 当前组件对象
     * @param item
     */
    handleClick (item) {
      let props = this.getComponentProps(item.elName)
      this.$store1.dispatch(this.modelId + '/addElement', { ...item, needProps: props })
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
  },
  watch: {
    customComps (val) {
      this.cusCompList = JSON.parse(JSON.stringify(val))
    }
  },
}
</script>

<style lang="scss">
.components-libs {
  user-select: none;
  height: 100%;
  width: 260px;
  position: relative;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: $font-color-base;
  overflow: auto;
  ul {
    padding: 20px;
  }
  .components-lib-base {
    padding: 20px 20px 10px 20px;
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
  .components-lib-cus-title {
    margin-bottom: 6px
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
    color: $font-color-base;
    text-align: center;
    background: transparent;
    width: calc(50% - 10px);
    float: left;
    border: 1px solid $border-color;
    font-size: 12px;
    cursor: pointer;
    transition: All 0.3s ease-in-out;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    border-radius: 4px;
    background: $page-bg-color;
    font-weight: 400;
    &:hover {
      border: 1px solid $border-color-active;
      color: $primary;
    }
    .lib-item-title {
      font-size: 13px;
      font-weight: 400;
    }
  }

  .cus-components-libs-title {
    font-size: 12px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    padding-bottom: 4px;
    padding-top: 10px;
  }
  .cus-components-lib-item {
    border: transparent;
    text-align: left;
    width: 30%;
    max-width: 33%;
    height: 22px;
    margin-bottom: 5px;
    line-height: 22px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    p {
      display: inline;
    }
    &:hover {
      border: transparent;
      color: $primary;
      background-color: $active-bg-color;
    }
  }
  .components-lib-item:nth-of-type(odd) {
    margin-right: 16px;
  }
  .components-lib-cus {
    position: relative;
    &::after {
      height: 1px;
      width: 100%;
      background-color: $line-color;
      content: ' ';
      display: block;
      position: absolute;
      bottom: 0;
      width: 220px;
    }
  }
  .base-components-libs-wrapper {
    overflow: hidden;
  }
}
</style>
