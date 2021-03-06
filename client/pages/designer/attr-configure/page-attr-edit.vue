<template>
  <div class="page-attr-edit">
    <AreaTitle
      title="标题模版设置"
      desc="设置模版名称和纸张大小"
    />
    <div class="page-item-edit-wrapper top">
      <p class="attr-item-title">模版名称</p>
      <el-input
        size="mini"
        v-model="pageData.name"
        placeholder=""
        :clearable="true"
      ></el-input>
    </div>
    <div class="page-item-edit-wrapper">
      <p class="attr-item-title">纸张</p>
      <el-select
        v-model="pageData.pageType"
        size="mini"
        @change="changePaper"
      >
        <el-option
          multiple="false"
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div
      class="page-item-edit-wrapper"
      v-if="pageData.pageType === 'custom'"
    >
      <p class="attr-item-title">页面宽度（mm）</p>
      <el-input
        size="small"
        v-model="customWidth"
        :clearable="true"
      ></el-input>
    </div>
    <div
      class="page-item-edit-wrapper"
      v-if="pageData.pageType === 'custom'"
    >
      <p class="attr-item-title">页面高度（mm）</p>
      <el-input
        size="small"
        v-model="customHeight"
        :clearable="true"
      ></el-input>
    </div>
    <div class="page-item-edit-wrapper">
      <p class="attr-item-title">页数</p>
      <el-input-number
        size="small"
        v-model="pageData.totalPages"
        :min="1"
        :step="1"
        :step-strictly="true"
        @change="handleChange"
      ></el-input-number>
    </div>
    <div class="page-item-edit-wrapper">
      <el-checkbox
        v-model="pageData.fixedHeader.openFixed"
        @change="opFixedArea('fixedHeader')"
      >开启页眉</el-checkbox>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedHeader.openFixed"
    >
      <el-radio-group v-model="pageData.fixedHeader.page">
        <el-radio label="1">第 1 页</el-radio>
        <el-radio label="2">第 1/n 页</el-radio>
      </el-radio-group>
    </div>
    <div class="page-item-edit-wrapper">
      <el-checkbox
        v-model="pageData.fixedFooter.openFixed"
        @change="opFixedArea('fixedFooter')"
      >开启页脚</el-checkbox>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedFooter.openFixed"
    >
      <el-radio-group v-model="pageData.fixedFooter.page">
        <el-radio label="1">第 1 页</el-radio>
        <el-radio label="2">第 1/n 页</el-radio>
      </el-radio-group>
    </div>
    <div class="page-item-edit-wrapper">
      <el-checkbox v-model="openPixel">辅助线</el-checkbox>
    </div>
    <div
      class="page-item-edit-wrapper"
      v-if="openPixel"
    >
      <p class="attr-item-title">网格密度(px)</p>
      <el-select
        v-model="pixelSize"
        size="mini"
        placeholder="请选择"
      >
        <el-option
          v-for="item in pixels"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
    <div class="page-item-edit-wrapper">
      <p class="attr-item-title">打印增加外边距（px）</p>
      <el-input
        size="small"
        v-model="outerPadding"
        :clearable="true"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AreaTitle from '@/components/area-title'
export default {
  data () {
    return {
      options: [
        {
          value: 'a4',
          label: 'A4'
        },
        {
          value: 'a5a',
          label: 'A5纵'
        },
        {
          value: 'a5b',
          label: 'A5横'
        },
        {
          value: 'custom',
          label: '自定义宽高'
        }
      ],
      customWidth: 210,
      customHeight: 297,
      openPixel: true,
      pixels: [5, 10, 20, 25, 50],
      pixelSize: 20,
      outerPadding: 0
    }
  },
  components: {
    AreaTitle,
  },
  inject: ['modelId'],
  computed: {
    ...mapState({
      pageData () {
        let state = this.$store1.state[this.modelId];
        return state?.pageData || {}
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
    }
  },
  created () {
    this.customWidth = +this.pageData.customWidth || this.customWidth
    this.customHeight = +this.pageData.customHeight || this.customHeight
    this.openPixel = this.pageData.openPixel
    this.pixelSize = this.pageData.pixelSize
    this.outerPadding = this.pageData.outerPadding || 0
  },
  methods: {
    opFixedArea (posi) {
      if (!this.pageData[posi].openFixed) {
        this.pageData[posi].page = '0'
      }
    },
    handleChange () {
      this.pageData.totalPages = Math.round(this.pageData.totalPages)
      this.changePaper()
    },
    changePaper () {
      let customWidth = this.pageData.width
      let radio
      switch (this.pageData.pageType) {
        case 'a4':
          this.customWidth = 210
          this.customHeight = 297
          radio = 297 / 210
          break
        case 'a5a':
          this.customWidth = 148
          this.customHeight = 210
          radio = 210 / 148
          break
        case 'a5b':
          this.customWidth = 210
          this.customHeight = 148
          radio = 148 / 210
          break
        default:
          radio = this.customHeight / this.customWidth
      }
      let customHeight = customWidth * radio
      this.$store1.dispatch(
        this.modelId + '/updateCanvasHeight',
        customHeight * this.pageData.totalPages
      )
    }
  },
  watch: {
    outerPadding (val) {
      this.pageData.outerPadding = val
    },
    customWidth (val) {
      this.pageData.customWidth = +val
      this.pageData.customHeight = +this.customHeight
      if (this.pageData.pageType === 'custom') {
        let radio = this.customHeight / val
        this.$store1.dispatch(
          this.modelId + '/updateCanvasHeight',
          this.pageData.width * radio * this.pageData.totalPages
        )
      }
    },
    customHeight (val) {
      this.pageData.customWidth = +this.customWidth
      this.pageData.customHeight = +val
      if (this.pageData.pageType === 'custom') {
        let radio = val / this.customWidth
        this.$store1.dispatch(
          this.modelId + '/updateCanvasHeight',
          this.pageData.width * radio * this.pageData.totalPages
        )
      }
    },
    openPixel (val) {
      this.pageData.openPixel = val
      let image
      if (val) {
        image =
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==")'
      }
      this.$store1.dispatch(this.modelId + '/updateGuideLine', image)
    },
    pixelSize (val) {
      this.pageData.pixelSize = val
      this.$store1.dispatch(this.modelId + '/updateBackSize', val)
    }
  }
}
</script>

<style lang="scss">
.page-attr-edit {
  .attr-title {
    font-weight: bold;
  }
  .top {
    padding-top: 10px;
  }
  .lf-30 {
    margin-left: 30px;
  }
  .page-item-edit-wrapper {
    padding: 16px 10px 0 10px;
    .attr-item-title {
      height: 30px;
      line-height: 30px;
      text-align: left;
      min-width: 60px;
      font-size: 14px;
      padding-bottom: 4px;
      color: $font-color-base;
      font-weight: 500;
    }
    .attr-item-edit-input {
      .attr-item-edit-input-des {
        text-align: center;
        line-height: 1;
        margin-top: 2px;
        font-size: 12px;
        color: $gray;
      }
    }
  }
}
</style>
