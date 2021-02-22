<template>
  <div class="base-attr">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="字符"
        name="1"
      >
        <div class="word-wrapper">
          <div class="word-edit-select">
            <el-select
              size="mini"
              v-model="activeElement.commonStyle.fontFamily"
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
          <div class="text-right">
            <el-color-picker
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.color"
            ></el-color-picker>
          </div>
        </div>
        <div class="word-wrapper">
          <div class="word-edit-input text-left marginR5">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.fontSize"
              controls-position="right"
              :min="0"
            />
          </div>
          <div class="word-edit-input text-center marginR5">
            <el-input-number
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.fontWeight"
              controls-position="right"
              :min="300"
              :step="100"
              :max="900"
            />
          </div>
          <div
            class="word-edit-input text-right"
            @click="activeElement.commonStyle.fontStyle = !activeElement.commonStyle.fontStyle"
          >
            <div
              class="ita"
              :class="{'active': activeElement.commonStyle.fontStyle}"
            ><span>I</span></div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 对齐方式 铺满画布-->
    <div class="attr-item-edit-wrapper">
      <div class="align-type">
        <div
          class="align-type-item"
          @click="handleTextAlignClick('left')"
        >
          <el-tooltip
            effect="dark"
            content="左对齐"
            placement="bottom"
          >
            <i
              class="iconfont iconalignt_l"
              :class="{'active': activeElement.commonStyle.textAlign === 'left'}"
            ></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item"
          @click="handleTextAlignClick('center')"
        >
          <el-tooltip
            effect="dark"
            content="居中对齐"
            placement="bottom"
          >
            <i
              class="iconfont iconalignt_c"
              :class="{'active': activeElement.commonStyle.textAlign === 'center'}"
            ></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item"
          @click="handleTextAlignClick('right')"
        >
          <el-tooltip
            effect="dark"
            content="右对齐"
            placement="bottom"
          >
            <i
              class="iconfont iconalignt_r"
              :class="{'active': activeElement.commonStyle.textAlign === 'right'}"
            ></i>
          </el-tooltip>
        </div>
      </div>
      <div class="align-type">
        <div
          class="align-type-item"
          @click="handleResizeClick('wh')"
        >
          <el-tooltip
            effect="dark"
            content="满屏"
            placement="bottom"
          >
            <i class="iconfont iconfit"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item"
          @click="handleResizeClick('w')"
        >
          <el-tooltip
            effect="dark"
            content="宽100%"
            placement="bottom"
          >
            <i class="iconfont iconfitw"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item"
          @click="handleResizeClick('h')"
        >
          <el-tooltip
            effect="dark"
            content="高100%"
            placement="bottom"
          >
            <i class="iconfont iconfith"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- 外观 -->
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="外观"
        name="2"
      >
        <div class="outlook">
          <el-checkbox
            class="fullfill"
            v-model="checkedBgColor"
          >
            <el-color-picker
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.backgroundColor"
            ></el-color-picker>填充
          </el-checkbox>
          <el-checkbox
            class="fullfill"
            v-model="checkedBorderColor"
          >
            <el-color-picker
              size="mini"
              @change="throttleAddHistory"
              v-model="activeElement.commonStyle.borderColor"
            ></el-color-picker>描边
          </el-checkbox>
          <div class="outlook-group">
            <div class="outlook-group-item">
              <el-input-number
                size="mini"
                v-model="activeElement.commonStyle.borderWidth"
                @change="throttleAddHistory"
                controls-position="right"
                :min="0"
              />
              <div class="outlook-group-desc">尺寸</div>
            </div>
            <div class="outlook-group-item">
              <el-select
                v-model="activeElement.commonStyle.borderStyle"
                @change="throttleAddHistory"
                size="mini"
              >
                <el-option
                  v-for="item in borderStyleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div class="outlook-group-desc">样式</div>
            </div>
            <div class="outlook-group-item">
              <el-input-number
                size="mini"
                @change="throttleAddHistory"
                v-model="activeElement.commonStyle.borderRadius"
                controls-position="right"
                :min="0"
              />
              <div class="outlook-group-desc">圆弧</div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="定位"
        name="3"
      >
        <div class="quick-op">
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
        <div class="quick outlook-group">
          <div class="outlook-group-item-w marginR5 ">
            <el-input-number
              size="mini"
              v-model="activeElement.commonStyle.top"
              controls-position="right"
            />
            <div class="outlook-group-desc">X</div>
          </div>
          <div class="outlook-group-item-w">
            <el-input-number
              size="mini"
              v-model="activeElement.commonStyle.left"
              controls-position="right"
            />
            <div class="outlook-group-desc">Y</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="尺寸"
        name="4"
      >
        <div class="quick outlook-group">
          <div class="outlook-group-item-w marginR5">
            <el-input-number
              size="mini"
              v-model="activeElement.commonStyle.width"
              controls-position="right"
              :min="0"
            />
            <div class="outlook-group-desc">宽度</div>
          </div>
          <div class="outlook-group-item-w marginR5">
            <el-input-number
              size="mini"
              v-model="activeElement.commonStyle.height"
              controls-position="right"
              :min="0"
            />
            <div class="outlook-group-desc">高度</div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="旋转"
        name="5"
      >
        <el-slider
          v-model="activeElement.commonStyle.rotate"
          @change="throttleAddHistory"
          show-input
          :min="-180"
          :max="180"
          :marks="{ 0: '', 90: '', '-90': '' }"
          input-size="mini"
        ></el-slider>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { ceil, subtract, divide, throttle } from 'lodash'
import {
  alignTypeList,
  borderStyleList,
  fontFamilyList
} from '@/config/attr-config'

export default {
  data () {
    return {
      activeNames: [],
      alignTypeList,
      borderStyleList,
      fontFamilyList
    }
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID,
      activeAttrEditCollapse: (state) => state.editor.activeAttrEditCollapse
    }),
    ...mapGetters(['activeElementIndex', 'activeElement']),
    checkedBgColor: {
      get () {
        return !!this.activeElement.commonStyle.backgroundColor
      },
      set (val) {
        return val
      }
    },
    checkedBorderColor: {
      get () {
        let { borderColor, borderWidth } = this.activeElement.commonStyle
        return !!borderColor && !!borderWidth
      },
      set (val) {
        return val
      }
    }
  },
  watch: {
    activeNames () {
      this.$store.commit('updateActiveAttrEditCollapse', this.activeNames)
    }
  },
  created () {
    this.throttleAddHistory = throttle(this.addHistory, 3000)
  },
  mounted () {
    this.activeNames = this.activeAttrEditCollapse
  },
  methods: {
    /**
     * 纪录一条历史纪录
     * */
    addHistory () {
      this.$store.dispatch('addHistoryCache')
    },
    /**
     * 对齐方式
     * @param type
     */
    changeAlignType (type) {
      let canvasW = this.pageData.width
      let canvasH = this.pageData.height
      let eleW = this.activeElement.commonStyle.width
      let eleH = this.activeElement.commonStyle.height

      switch (type) {
        case 't':
          this.activeElement.commonStyle.top = 0
          break
        case 'b':
          this.activeElement.commonStyle.top = subtract(canvasH - eleH - 20)
          break
        case 'l':
          this.activeElement.commonStyle.left = 0
          break
        case 'r':
          this.activeElement.commonStyle.left = subtract(canvasW - eleW) - 20
          break
        case 'tb':
          this.activeElement.commonStyle.top = ceil(
            divide(subtract(canvasH - eleH - 20), 2),
            2
          )
          break
        case 'lr':
          this.activeElement.commonStyle.left =
            ceil(divide(subtract(canvasW - eleW), 2), 2) - 10
          break
      }
      this.addHistory()
    },
    /**
     * 字体样式设置对齐方式
     * @param str
     */
    handleTextAlignClick (str) {
      this.activeElement.commonStyle.textAlign = str
      this.addHistory()
    },
    /**
     * 字体样式设置对齐方式
     * @param str
     */
    handleResizeClick (type) {
      if (type.includes('w')) {
        this.activeElement.commonStyle.left = 0
        this.activeElement.commonStyle.width = this.pageData.width - 20
      }
      if (type.includes('h')) {
        this.activeElement.commonStyle.top = 0
        this.activeElement.commonStyle.height = this.pageData.height - 20
      }
      this.addHistory()
    }
  }
}
</script>

<style lang="scss">
.base-attr {
  .word-wrapper {
    display: flex;
    width: 100%;
    .word-edit-select {
      width: 212px;
    }
    .word-edit-input {
      width: fit-content;
      .el-input-number--mini {
        width: 104px;
      }
    }
    .ita {
      font-style: italic;
      border: 1px solid $border-color;
      font-size: 12px;
      width: 18px;
      height: 18px;
      display: inline-block;
      text-align: center;
      line-height: 12px;
      padding: 3px;
      margin: 4px 0;
      &.active {
        border: 1px solid $primary;
        background: $active-bg-color;
        color: $primary;
      }
    }
  }
  .align-type {
    width: 102px;
    display: flex;
    margin-right: 5px;
    .align-type-item {
      flex: 1;
      cursor: pointer;
      height: 35px;
      line-height: 40px;
      margin: 20px 0;
      &.clearFlex {
        width: 42px;
        flex: none;
      }
      i {
        line-height: 1;
        display: inline-block;
        height: 34px;
        width: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid $border-color;
        background: $page-bg-color;
        color: $font-color-base;
        &.active {
          border: 1px solid $primary;
          background: $active-bg-color;
          color: $primary;
        }
      }
      &:hover {
        i {
          color: white;
          background: $primary;
        }
      }
    }
  }
  .outlook {
    .fullfill {
      display: block;
    }
    .el-color-picker__color {
      display: inline-block;
      padding: 0;
    }
    .el-color-picker--mini {
      height: 18px;
      padding-right: 10px;
    }
    .el-color-picker__trigger {
      padding: 0;
      height: 18px;
      width: 18px;
    }
  }

  .outlook-group {
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    .outlook-group-item {
      width: 76px;
    }
    .outlook-group-item-w {
      width: 113px;
    }
    .outlook-group-desc {
      text-align: center;
      line-height: 1;
      margin-top: 2px;
      font-size: 12px;
      color: $gray;
    }
    .el-input-number--mini {
      width: 100%;
    }
    .el-input-number.is-controls-right .el-input__inner {
      padding-left: 5px;
      padding-right: 40px;
    }
  }

  .quick-op {
    border: 1px solid $border-color;
    width: 230px;
    .align-type-item {
      display: inline-block;
      padding: 5px 10px;
      color: $font-color-base;
    }
  }
  .quick {
    &.outlook-group {
      justify-content: start;
      margiin-right: 5px;
    }
  }

  .page-title {
    position: relative;
    top: 0;
    font-weight: 700;
  }
  .sizeAndPosition-wrapper {
    display: flex;
    width: 100%;
  }

  .attr-item-edit-wrapper {
    display: flex;
    width: 100%;
  }
}
</style>
