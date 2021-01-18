<template>
  <el-scrollbar class="common-attr-edit">
    <div class="attr-header">
      <div>合并编辑</div>
      <div class="attr-header-desc">编辑后同步更新选中组件</div>
    </div>
    <div class="attr-header-line"></div>
    <div class="attr-item-edit-wrapper">
      <el-form>
        <el-form-item
          label="等分布局"
          v-if="formQuickOp"
        >
          <el-input-number
            v-model="numb"
            :min="1"
          ></el-input-number>等分
        </el-form-item>
        <el-form-item
          :inline="true"
          label="混合布局(逗号分割，每行24）"
          v-if="numb === 1"
        >
          <el-input
            v-model="mixLayout"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="hideOnPrint">打印隐藏</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">快捷定位：</p>
      <div class="sizeAndPosition-wrapper">
        <div
          class="align-type-item"
          v-for="item in alignTypeList"
          :key="item.type"
          @click="changeAlignType(item.type)"
        >
          <el-tooltip
            effect="dark"
            :content="item.title"
            placement="bottom"
          >
            <i :class="[item.icon]"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">字体：</p>
      <div class="attr-item-edit-input">
        <el-select
          size="mini"
          v-model="fontFamily"
          placeholder="请选择"
          @change="throttleAddHistory"
        >
          <el-option
            v-for="item in fontFamilyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">斜体：</p>
      <div class="col-2 attr-item-edit-input">
        <el-checkbox v-model="fontStyle">倾斜</el-checkbox>
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">字体大小：</p>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="fontSize"
          controls-position="right"
        />
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">字体粗细：</p>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="fontWeight"
          controls-position="right"
          :step="100"
          :max="900"
        />
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">对齐方式：</p>
      <div class="sizeAndPosition-wrapper">
        <div
          class="align-type-item clearFlex"
          @click="updateStyle('textAlign', 'left')"
        >
          <el-tooltip
            effect="dark"
            content="左对齐"
            placement="bottom"
          >
            <i class="iconfont iconzuoduiqi1"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item clearFlex"
          @click="updateStyle('textAlign', 'center')"
        >
          <el-tooltip
            effect="dark"
            content="居中对齐"
            placement="bottom"
          >
            <i class="iconfont iconjuzhongduiqi"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item clearFlex"
          @click="updateStyle('textAlign', 'right')"
        >
          <el-tooltip
            effect="dark"
            content="右对齐"
            placement="bottom"
          >
            <i class="iconfont iconyouduiqi2"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">字体颜色：</p>
      <div class="attr-item-edit-input">
        <el-color-picker
          size="mini"
          v-model="color"
        ></el-color-picker>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { alignTypeList, fontFamilyList } from '@client/config/attr-config'
import { ceil, subtract, divide, throttle } from 'lodash'

export default {
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      activeElementsUUID: (state) => state.editor.activeElementsUUID,
    }),
    ...mapGetters(['activeElementIndex', 'activeElement']),
  },
  data() {
    return {
      alignTypeList,
      fontFamilyList,
      fontFamily: '',
      fontStyle: null,
      fontSize: null,
      fontWeight: null,
      color: '',
      elements: () => [],
      hideOnPrint: false,
      formQuickOp: false,
      numb: 1,
      mixLayout: '',
      activeElements: () => [],
    }
  },
  created() {
    this.throttleAddHistory = throttle(this.addHistory, 3000)
  },
  mounted() {
    this.diffElementStyle()
  },
  watch: {
    mixLayout(val) {
      let l = (val && val.split(',')) || []

      let elements = this.activeElements
      let top = elements[0].commonStyle.top
      elements[0].commonStyle.left = 0
      let height = elements[0].commonStyle.height
      let paperW = this.pageData.width - 20

      let x = 0,
        y = 0

      for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        // 如果未指定或含有非数字字符以及大于24，转为行布局
        if (!+l[i] || l[i] > 24) {
          l[i] = 24
        }
        element.commonStyle.width = paperW * (+l[i] / 24)
        if (i !== 0) {
          if (
            x + elements[i - 1].commonStyle.width + element.commonStyle.width >
            paperW
          ) {
            x = 0
            y = y + 1
          } else {
            x += elements[i - 1].commonStyle.width
          }
          element.commonStyle.height = height
          element.commonStyle.top = top + height * y
          element.commonStyle.left = x
        }
      }
    },
    activeElementsUUID() {
      this.diffElementStyle()
    },
    numb(val) {
      if (val === 1) {
        return
      }
      let elements = this.activeElements
      let top = elements[0].commonStyle.top
      let left = (elements[0].commonStyle.left = 0)
      let height = elements[0].commonStyle.height
      let width = (this.pageData.width - 20) / val
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        element.commonStyle.width = width - 5
        element.commonStyle.height = height
        element.commonStyle.top = top + Math.floor(i / val) * height
        element.commonStyle.left = left + (i % val) * width
      }
    },
    hideOnPrint(val) {
      let elements = this.activeElements
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        element.hideOnPrint = val
      }
    },
    selFontFamily(val, oldVal) {
      if (oldVal) {
        this.updateStyle('fontFamily', val)
      }
    },
    fontStyle(val, oldVal) {
      if (oldVal !== null) {
        this.updateStyle('fontStyle', val)
      }
    },
    fontSize(val, oldVal) {
      if (oldVal) {
        this.updateStyle('fontSize', val)
      }
    },
    fontWeight(val, oldVal) {
      if (oldVal) {
        this.updateStyle('fontWeight', val)
      }
    },
    color(val, oldVal) {
      if (oldVal) {
        this.updateStyle('color', val)
      }
    },
  },
  methods: {
    // 更新匹配组件的对应样式---公共方法，勿改
    updateStyle(commonStyle, val = '', type = '') {
      for (let i = 0; i < this.activeElements.length; i++) {
        let element = this.activeElements[i]
        if (commonStyle === 'alignType') {
          this.delWithElementAlignType(element, type)
        } else {
          element.commonStyle[commonStyle] = val
        }
      }
      this.addHistory()
    },
    // 初始化的时候对比多个element
    diffElementStyle() {
      let elements = this.pageData.elements
      this.activeElements = []
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i]
        if (this.activeElementsUUID.indexOf(element.uuid) > -1) {
          this.activeElements.push(element)
        }
      }

      this.doDiff(this.activeElements)
      this.diffType(this.activeElements)
    },
    // 判断form节点
    diffType(eles) {
      let onlyFormEle = true
      let formEles = [
        'rad-input',
        'rad-text',
        'rad-radio',
        'rad-checkbox',
        'rad-select',
      ]
      for (let i = 1; i < eles.length; i++) {
        if (!formEles.includes(eles[i].elName)) {
          onlyFormEle = false
          break
        }
      }
      if (onlyFormEle) {
        this.formQuickOp = true
      }
    },
    // 执行激活控件的diff样式操作
    doDiff(eles) {
      let styles = [
        'fontFamily',
        'alignType',
        'fontStyle',
        'fontSize',
        'fontWeight',
        'color',
        'textAlign',
      ]
      let diffMap = {
        fontFamily: false,
        alignType: false,
        fontStyle: false,
        fontSize: false,
        fontWeight: false,
        color: false,
        textAlign: false,
      }

      for (let j = 0; j < styles.length; j++) {
        let styleItem = styles[j]
        for (let i = 1; i < eles.length; i++) {
          if (
            eles[i].commonStyle[styleItem] !== eles[0].commonStyle[styleItem]
          ) {
            diffMap[styleItem] = true
            break
          }
        }
      }
      for (let key in diffMap) {
        if (!diffMap[key]) {
          this[key] = eles[0].commonStyle[key]
        }
      }
    },
    // 纪录一条历史纪录
    addHistory() {
      this.$store.dispatch('addHistoryCache')
    },
    // 更新样式
    changeAlignType(type) {
      this.updateStyle('alignType', '', type)
    },
    // 处理吸边操作
    delWithElementAlignType(element, type) {
      let canvasW = this.pageData.width
      let canvasH = this.pageData.height
      let eleW = element.commonStyle.width
      let eleH = element.commonStyle.height

      switch (type) {
        case 't':
          element.commonStyle.top = 0
          break
        case 'b':
          element.commonStyle.top = subtract(canvasH - eleH - 20)
          break
        case 'l':
          element.commonStyle.left = 0
          break
        case 'r':
          element.commonStyle.left = subtract(canvasW - eleW) - 20
          break
        case 'tb':
          element.commonStyle.top = ceil(
            divide(subtract(canvasH - eleH - 20), 2),
            2
          )
          break
        case 'lr':
          element.commonStyle.left =
            ceil(divide(subtract(canvasW - eleW), 2), 2) - 10
          break
      }
    },
  },
}
</script>

<style lang="scss">
.common-attr-edit {
  height: 100%;
}
.attr-title {
  font-weight: bold;
}
.attr-header {
  font-size: 14px;
  font-weight: 500;
  padding: 20px 20px 10px 20px;
  color: #161616;
  line-height: 22px;
  .attr-header-desc {
    font-weight: 400;
    color: #707070;
    line-height: 22px;
    padding-top: 4px;
  }
}
.attr-header-line {
  height: 1px;
  width: 100%;
  background-color: #adb1b8;
}
.sizeAndPosition-wrapper {
  display: flex;
  width: 100%;
}
.align-type-item {
  margin-right: 10px;
  cursor: pointer;
  &.clearFlex {
    width: 42px;
    flex: none;
  }
  i {
    line-height: 1;
    display: inline-block;
    padding: 6px;
    border-radius: 4px;
    background: rgba(37, 165, 137, 0.08);
  }
  &:hover {
    i {
      color: white;
      background: $primary;
    }
  }
}
.attr-item-edit-wrapper {
  text-align: left;
  padding: 10px 20px;
  font-weight: 500;
  .attr-item-title {
    text-align: left;
    min-width: 78px;
    font-size: 14px;
    color: #161616;
    line-height: 22px;
    padding-bottom: 4px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .attr-item-edit-input {
    &.col-2 {
      margin-left: 10px;
    }
    &.col-1 {
      width: 250px;
    }
    &.col-3 {
      width: 60px;
      margin-left: 10px;
    }
    &.col-4 {
      width: 50px;
      margin-left: 10px;
    }
    .attr-item-edit-input-des {
      text-align: center;
      line-height: 1;
      margin-top: 2px;
      font-size: 12px;
      color: $gray;
    }
  }
}
.attr-item-edit-wrapper {
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
    padding-right: 32px;
    width: 90px;
  }
  .el-input-number--mini {
    width: 90px;
  }
  .el-slider__runway.show-input {
    margin-right: 108px;
  }
}
</style>
