<template>
  <div class="rad-imagepicker">
    <!-- 设计模式 -->
    <div
      class="rad-imagepicker-inner"
      v-if="pagetype === 'designer'"
    >
      <div class="imagepicker-placeholder">
        <i class="el-icon-picture"></i>
        <div class="imagepicker-placeholder-text">图片占位符</div>
      </div>
    </div>
    <!-- 编辑模式 || 预览模式已上传最大数量的图片 || 预览模式优先铺满宽度 -->
    <vuedraggable
      v-model="fileList"
      @change="changeImages"
      class="pic-group"
      :style="groupStyle"
      v-else-if="pagetype === 'editor'"
    >
      <div
        :style="liStyle(idx)"
        class="is-ready el-upload-list__item"
        v-for="(item, idx) in fileList"
        :key="idx"
        @mouseover="hoverIndex = idx"
        @mouseleave="hoverIndex = -1"
      >
        <div
          class="img-container"
          style="height: 100%;width: 100%;"
        >
          <img
            style="height: 100%;"
            :src="item.url"
            :style="imageStyle"
          />
          <span
            class="el-upload-list__item-actions"
            v-show="hoverIndex === idx"
          >
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(idx, item)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </div>
      <el-upload
        v-if="pagetype==='editor'"
        v-show="fileList.length < +imagepicker"
        :style="{
          width:
            'calc((100% - ' +
            picDis * (linepics - 1) +
            'px)' +
            '/' +
            linepics +
            ')',
          height: perHeight + 'px',
        }"

        class="upload-demo"
        drag
        list-type="picture-card"
        :id="uploadId"
        :auto-upload="false"
        action="#"
        :file-list="fileList"
        :show-file-list="false"
        :limit="imagepicker"
        :on-exceed="handleExceed"
        :on-change="handleFiles"
        multiple
      >
        <i
          slot="default"
          class="el-icon-plus"
        ></i>
      </el-upload>
    </vuedraggable>
    <!-- 预览模式 自适应布局 -->
    <div
      :style="lineStyle"
      v-else
    >
      <div
        v-for="(item, idx) in fileList"
        :key="idx"
        :style="fixType === 1 ? liStyle(idx) : imgStyle(idx)"
      >
        <img
          :src="item.url"
          :style="imageStyle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import bus from '@/utils/bus'
export default {
  name: 'RadImagepicker',
  props: {
    imagepicker: {
      type: Number,
      default: 1
    },
    linepics: {
      type: Number,
      default: 1
    },
    picDis: {
      type: Number,
      default: 2
    },
    rowDis: {
      type: Number,
      default: 2
    },
    pagetype: String,
    commonStyle: {
      type: Object,
      default: () => { }
    },
    element: {
      type: Object,
      default: () => { }
    },
    fixType: {
      type: Number,
      default: 3
    }
  },
  components: { vuedraggable },
  data () {
    return {
      fileList: [],
      hoverIndex: -1,
      groupStyle: {
        height: '100%',
        width: '100%',
        'text-align': 'left'
      },
      imageStyle: {
        height: '100%',
        margin: '0 auto',
        display: 'block',
        width: '100%'
      },
      relLinePics: this.linepics,
      uploadId: `imagepicker_${new Date().getTime()}_${this.element?.threshold || ''}`
    }
  },
  computed: {
    perHeight () {
      let rows = Math.ceil(this.imagepicker / this.linepics)
      return (
        (this.commonStyle.height - rows * this.element.propsValue.rowDis) / rows
      )
    },
    liStyle () {
      return function (idx) {
        return {
          width: `${(this.commonStyle.width - this.picDis * (this.linepics - 1)) / this.linepics}px`,
          height: `${this.perHeight}px`,
          marginBottom:
            this.imagepicker - idx <= this.linepics ? 0 : `${this.rowDis}px`,
          paddingRight: (idx + 1) % this.linepics === 0 ? 0 : `${this.picDis}px`,
          display: 'inline-block'
        }
      }
    },
    lineStyle () {
      if (this.fixType === 3) {
        let len = this.fileList.length
        let maxRow = Math.ceil(this.imagepicker / this.linepics)
        let sqr = Math.sqrt(len)
        if (sqr % 1 !== 0) {
          sqr = Math.ceil(sqr)
        }
        if (sqr > maxRow) {
          sqr = maxRow
        }
        let width = (this.commonStyle.width - this.picDis * (this.linepics - 1)) / this.linepics
        let lineWidth = width * sqr + this.picDis * (sqr - 1)
        return {
          width: lineWidth + 'px',
          margin: '0 auto',
          'text-align': 'left'
        }
      }
      return {}
    },
    imgStyle () {
      return function (idx) {
        let len = this.fileList.length
        let maxRow = Math.ceil(this.imagepicker / this.linepics)
        let sqr = Math.sqrt(len)
        if (sqr % 1 !== 0) {
          sqr = Math.ceil(sqr)
        }
        if (sqr > maxRow) {
          sqr = maxRow
        }
        if (this.fixType === 2) {
          return {
            width: `${(this.commonStyle.width - this.picDis * (sqr - 1)) / sqr}px`,
            height: `${(this.commonStyle.height - this.picDis * (Math.ceil(len / sqr) - 1)) / Math.ceil(len / sqr)}px`,
            'text-align': 'left',
            display: 'inline-block',
            paddingRight: (idx + 1) % sqr === 0 ? 0 : `${this.picDis}px`,
            paddingBottom: idx < sqr * (sqr - 1) ? `${this.picDis}px` : 0
          }
        } else if (this.fixType === 3) {
          let width = (this.commonStyle.width - this.picDis * (this.linepics - 1)) / this.linepics
          return {
            width: `${width}px`,
            height: `${this.commonStyle.height / Math.ceil(len / sqr)}px`,
            'text-align': 'left',
            display: 'inline-block',
            paddingRight: (idx + 1) % sqr === 0 ? 0 : `${this.picDis} px`,
            paddingBottom: idx < sqr * (sqr - 1) ? `${this.picDis} px` : 0
          }
        }
        return {}
      }
    }
  },
  created () {
    this.fileList = (this.element && this.element.value) || []
    if (this.pagetype === 'editor') {
      window[this.modelId] = window[this.modelId] || {}
      window[this.modelId].imagePicker = window[this.modelId].imagePicker || {}
      window[this.modelId].imagePicker[this.uploadId] = {
        resetPics: this.resetPics,
        deletePics: this.deletePics,
        insertPics: this.insertPics,
        fileList: this.fileList
      }
    }
  },
  inject: ['modelId'],
  destroyed () {
    if (window?.[this.modelId]?.imagePicker?.[this.uploadId]) {
      delete window[this.modelId].imagePicker[this.uploadId];
    }
  },
  methods: {
    /**
     * @description: 编辑模式挂载到window上的方法，用于全量替换图片
     * @param {*} fileList
     * @return {*}
     */
    resetPics (fileList = []) {
      this.fileList = fileList
    },
    /**
     * @description: 编辑模式挂载到window上的方法，用于批量删除图片
     * @param {*} indexs
     * @return {*}
     */
    deletePics (indexs = []) {
      indexs.sort((a, b) => {
        return b - a
      })
      indexs.forEach((index) => {
        if (index >= 0) {
          this.fileList.splice(index, 1)
        }
      })
    },
    /**
     * @description: 编辑模式挂载到window上的方法，用于插入图片
     * @param {*} files
     * @param {*} index
     * @return {*}
     */
    insertPics (files, index) {
      if (index >= this.imagepicker) {
        this.$confirm(
          `最多可以上传 ${this.imagepicker} 张图片`,
          '提示',
          {
            confirmButtonText: '确定',
            type: 'warning',
            showCancelButton: false,
            closeOnClickModal: false
          }
        ).then(() => { })
        return
      }
      if (index >= 0) {
        this.fileList.splice(index, 0, files)
      }
    },
    handleRemove (idx, item) {
      this.fileList.splice(idx, 1)
      // 向总线发事件通知外部当前图片被删除
      bus.$emit('removeImages', {
        id: item.id
      })
      this.changeImages()
    },
    handleFiles (file) {
      let reader = new FileReader()
      let _this = this
      reader.onload = function (e) {
        _this.fileList.push({
          url: e.target.result
        })
        _this.changeImages()
      }
      reader.readAsDataURL(file.raw)
    },
    handleExceed (files, fileList) {
      this.$confirm(
        `当前限制选择 ${this.imagepicker} 个文件, 本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length
        } 个文件, 请重新选择。`,
        '提示',
        {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false,
          closeOnClickModal: false
        }
      ).then(() => { })
    },
    changeImages () {
      bus.$emit('updateImages', {
        threshold: this.element?.threshold || null,
        fileList: this.fileList || []
      })
    }
  },
  deactivated () {
    if (this.element && this.element.threshold && window?.[this.modelId]?.imagePicker?.[this.element.threshold]) {
      delete window[this.modelId].imagePicker[this.element.threshold]
    }
  },
  beforeDestroy () {
    if (this.element && this.element.threshold && window?.[this.modelId]?.imagePicker?.[this.element.threshold]) {
      delete window[this.modelId].imagePicker[this.element.threshold]
    }
  },
  watch: {
    fileList (val) {
      this.$emit('update:value', val)
    }
  }
}
</script>
<style lang="scss">
.rad-imagepicker {
  height: 100%;
  width: 100%;
  .rad-imagepicker-inner {
    border: 1px solid #adb1b8;
    width: 100%;
    height: 100%;
    font-size: 20px;
    font-weight: 400;
    color: #000;
    text-align: center;
    .imagepicker-placeholder {
      position: absolute;
      top: calc(50% - 28px);
      left: calc(50% - 50px);
      vertical-align: baseline;
      display: inline-block;
    }
  }
  .el-icon-picture {
    font-size: 30px;
  }
  .el-upload--picture-card {
    border: none;
    height: 100%;
  }
  .upload-demo {
    display: inline-flex;
    align-items: center;
  }
  .el-image {
    border: none;
  }
  .img-container {
    height: 100%;
    width: 100%;
  }
  .el-upload-list__item {
    margin-top: 0;
    .el-icon-delete {
      color: $white;
    }
  }
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: $white;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    .el-upload-list__item-delete {
      display: block;
      font-size: 40px;
      top: calc(50% - 32px);
      left: 0;
      width: 100%;
    }
  }
  .el-upload-dragger {
    height: 100%;
    align-items: center;
    position: relative;
    .el-icon-plus {
      position: absolute;
      top: calc(50% - 15px);
      left: calc(50% - 15px);
    }
  }
  .el-upload-list__item-thumbnail {
    height: 100%;
  }
}
</style>
