<template>
  <div class="base-attr">
    <p class="page-title">基础样式</p>
    <p class="attr-title">字体</p>
    <div class="attr-item-edit-wrapper">
      <div class="attr-item-edit-input sel-width">
        <el-select
          size="mini"
          v-model="activeElement.commonStyle.fontFamily"
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
        <div class="attr-item-edit-input-des">字体</div>
      </div>
      <div class="ml attr-item-edit-input">
        <el-input-number
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.fontSize"
          controls-position="right"
          :min="0"
        />
        <div class="attr-item-edit-input-des">字号</div>
      </div>
      <div class="ml attr-item-edit-input">
        <el-input-number
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.fontWeight"
          controls-position="right"
          :min="300"
          :step="100"
          :max="900"
        />
        <div class="attr-item-edit-input-des">粗细</div>
      </div>
      <div class="ml attr-item-edit-input">
        <el-color-picker
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.color"
        ></el-color-picker>
      </div>
      <div class="ml attr-item-edit-input">
        <el-checkbox
          v-model="activeElement.commonStyle.fontStyle"
          @change="throttleAddHistory"
        >
          <span class="ita">A</span>
        </el-checkbox>
      </div>
    </div>
    <!--边框-->
    <p class="attr-title">边框：</p>
    <div class="attr-item-edit-wrapper">
      <div class="attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activeElement.commonStyle.borderWidth"
          @change="throttleAddHistory"
          controls-position="right"
          :min="0"
        />
        <div class="attr-item-edit-input-des">尺寸</div>
      </div>
      <div class="attr-item-edit-input sel-width ml">
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
        <div class="attr-item-edit-input-des">样式</div>
      </div>
      <div class="attr-item-edit-input ml">
        <el-input-number
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.borderRadius"
          controls-position="right"
          :min="0"
        />
        <div class="attr-item-edit-input-des">圆弧</div>
      </div>
      <div class="attr-item-edit-input ml">
        <el-color-picker
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.borderColor"
        ></el-color-picker>
        <div class="attr-item-edit-input-des">颜色</div>
      </div>
      <div class="attr-item-edit-input ml">
        <el-color-picker
          size="mini"
          @change="throttleAddHistory"
          v-model="activeElement.commonStyle.backgroundColor"
        ></el-color-picker>
        <div class="attr-item-edit-input-des">背景色</div>
      </div>
    </div>
    <p class="attr-title">位置：</p>
    <div class="attr-item-edit-wrapper">
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activeElement.commonStyle.top"
          controls-position="right"
        />
        <div class="attr-item-edit-input-des">X</div>
      </div>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activeElement.commonStyle.left"
          controls-position="right"
        />
        <div class="attr-item-edit-input-des">Y</div>
      </div>
    </div>
    <p class="attr-title">尺寸</p>
    <div class="attr-item-edit-wrapper">
      <div class="attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activeElement.commonStyle.width"
          controls-position="right"
          :min="0"
        />
        <div class="attr-item-edit-input-des">宽度</div>
      </div>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activeElement.commonStyle.height"
          controls-position="right"
          :min="0"
        />
        <div class="attr-item-edit-input-des">高度</div>
      </div>
    </div>
    <p class="attr-title">快捷定位</p>
    <div class="attr-item-edit-wrapper marginB15">
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
    <p class="attr-title">对齐方式：</p>
    <div class="attr-item-edit-wrapper">
      <div class="sizeAndPosition-wrapper">
        <div
          class="align-type-item clearFlex"
          @click="handleTextAlignClick('left')"
        >
          <el-tooltip
            effect="dark"
            content="左对齐"
            placement="bottom"
          >
            <i class="iconfont iconalignt_l"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item clearFlex"
          @click="handleTextAlignClick('center')"
        >
          <el-tooltip
            effect="dark"
            content="居中对齐"
            placement="bottom"
          >
            <i class="iconfont iconalignt_c"></i>
          </el-tooltip>
        </div>
        <div
          class="align-type-item clearFlex"
          @click="handleTextAlignClick('right')"
        >
          <el-tooltip
            effect="dark"
            content="右对齐"
            placement="bottom"
          >
            <i class="iconfont iconalignt_r"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <p class="attr-title">铺满：</p>
    <div class="attr-item-edit-wrapper">
      <div class="sizeAndPosition-wrapper">
        <div
          class="align-type-item clearFlex"
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
          class="align-type-item clearFlex"
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
          class="align-type-item clearFlex"
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
    <p class="attr-title">旋转：</p>
    <div class="attr-item-edit-wrapper">
      <div class="col-1 attr-item-edit-input">
        <el-slider
          v-model="activeElement.commonStyle.rotate"
          @change="throttleAddHistory"
          show-input
          :min="-180"
          :max="180"
          :marks="{ 0: '', 90: '', '-90': '' }"
          input-size="mini"
        ></el-slider>
      </div>
    </div>
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
      activeNames: ['1'],
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
    ...mapGetters(['activeElementIndex', 'activeElement'])
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
    }
  }
}
</script>

<style lang="scss">
.base-attr {
  .page-title {
    position: relative;
    top: 0;
    font-weight: 700;
  }
  .sizeAndPosition-wrapper {
    display: flex;
    width: 100%;
  }

  .align-type-item {
    flex: 1;
    cursor: pointer;
    text-align: center;
    &.clearFlex {
      width: 42px;
      flex: none;
    }
    i {
      line-height: 1;
      display: inline;
      height: 18px;
      width: 18px;
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
    display: flex;
    width: 100%;
    text-align: center;
    padding: 4px 0;
    .attr-item-title {
      text-align: left;
      min-width: 78px;
      font-size: 14px;
      color: $font-color-base;
    }
    .sel-width {
      min-width: 95px;
    }
    .attr-item-edit-input {
      &.ml {
        margin-left: 5px;
        flex: 1;
      }
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
    .ita {
      font-style: italic;
    }
  }
  .attr-title {
    font-size: 14px;
    font-weight: 500;
    color: $font-color-base;
    padding: 10px 0;
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
}
</style>
