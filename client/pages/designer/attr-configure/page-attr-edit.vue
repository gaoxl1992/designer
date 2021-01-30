<template>
  <el-scrollbar class="page-attr-edit">
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
      ></el-input>
    </div>
    <div class="page-item-edit-wrapper">
      <p class="attr-item-title">页数</p>
      <el-input-number
        size="small"
        v-model="pageData.totalPages"
        :min="1"
        @change="handleChange"
      ></el-input-number>
    </div>
    <div class="page-item-edit-wrapper">
      <el-checkbox v-model="pageData.fixedHeader.openFixed">开启页眉</el-checkbox>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedHeader.openFixed"
    >
      <span>页码</span>
      <el-switch
        style="float: right"
        v-model="pageData.fixedHeader.pageNum"
      >
      </el-switch>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedHeader.openFixed && pageData.fixedHeader.pageNum"
    >
      <el-radio-group v-model="pageData.fixedHeader.page">
        <el-radio label="1">第 1 页</el-radio>
        <el-radio label="2">第 1/n 页</el-radio>
      </el-radio-group>
    </div>
    <div class="page-item-edit-wrapper">
      <el-checkbox v-model="pageData.fixedFooter.openFixed">开启页脚</el-checkbox>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedFooter.openFixed"
    >
      <p>页码</p>
      <el-switch
        size="mini"
        style="float: right"
        v-model="pageData.fixedFooter.pageNum"
      >
      </el-switch>
    </div>
    <div
      class="page-item-edit-wrapper lf-30"
      v-if="pageData.fixedFooter.openFixed && pageData.fixedFooter.pageNum"
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
  </el-scrollbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
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
      pixelSize: 20
    }
  },
  components: {
    AreaTitle,
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData,
      activeElementUUID: (state) => state.editor.activeElementUUID
    }),
    ...mapGetters(['activeElementIndex', 'activeElement'])
  },
  created () {
    this.customWidth = +this.pageData.customWidth || this.customWidth
    this.customHeight = +this.pageData.customHeight || this.customHeight
  },
  methods: {
    handleChange () {
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
      this.$store.dispatch(
        'updateCanvasHeight',
        customHeight * this.pageData.totalPages
      )
    }
  },
  watch: {
    customWidth (val) {
      this.pageData.customWidth = +val
      this.pageData.customHeight = +this.customHeight
      if (this.pageData.pageType === 'custom') {
        let radio = this.customHeight / val
        this.$store.dispatch(
          'updateCanvasHeight',
          this.pageData.width * radio * this.pageData.totalPages
        )
      }
    },
    customHeight (val) {
      this.pageData.customWidth = +this.customWidth
      this.pageData.customHeight = +val
      if (this.pageData.pageType === 'custom') {
        let radio = val / this.customWidth
        this.$store.dispatch(
          'updateCanvasHeight',
          this.pageData.width * radio * this.pageData.totalPages
        )
      }
    },
    openPixel (val) {
      let image
      if (val) {
        image =
          'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==")'
      }
      this.$store.dispatch('updateGuideLine', image)
    },
    pixelSize (val) {
      this.$store.dispatch('updateBackSize', val)
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
    padding: 16px 20px 0 20px;
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
      &.col-2 {
        width: 90px;
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
}
</style>
