<template>
  <div class="rad-imagepicker">
    <div
      class="rad-imagepicker-inner"
      v-if="pagetype === 'designer'"
    >
      <div class="imagepicker-placeholder">
        <i class="el-icon-picture"></i>
        <div class="imagepicker-placeholder-text">图片占位符</div>
      </div>
    </div>
    <div
      class="pic-group"
      :style="groupStyle"
      v-else
    >
      <div
        :style="liStyle(idx)"
        class="is-ready"
        :class="{
          'el-upload-list__item': pagetype === 'editor'
        }"
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
            v-show="hoverIndex === idx && pagetype==='editor'"
          >
            <span
              class="el-upload-list__item-delete"
              @click="handleRemove(idx)"
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
    </div>
  </div>
</template>

<script>
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
    }
  },
  data () {
    return {
      fileList: [],
      hoverIndex: -1,
      groupStyle: {
        display: 'table',
        height: '100%',
        width: '100%'
      },
      imageStyle: {
        height: '100%',
        margin: '0 auto',
        display: 'block'
      }
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
          float: 'left'
        }
      }
    }
  },
  created () {
    this.fileList = (this.element && this.element.value) || []
    if (this.pagetype === 'editor' && this.element.threshold) {
      window.imagePicker = window.imagePicker || {}
      window.imagePicker[this.element.threshold] = {
        resetPics: this.resetPics,
        deletePics: this.deletePics,
        insertPics: this.insertPics
      }
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
      if (index >= 0) {
        this.fileList.splice(index, 0, files)
      }
    },
    handleRemove (idx) {
      this.fileList.splice(idx, 1)
    },
    handleFiles (file) {
      let reader = new FileReader()
      let _this = this
      reader.onload = function (e) {
        _this.fileList.push({
          url: e.target.result
        })
      }
      reader.readAsDataURL(file.raw)
    },
    handleExceed (files, fileList) {
      this.$confirm(
        `当前限制选择 ${this.imagepicker} 个文件,本次选择了 ${files.length
        } 个文件，共选择了 ${files.length + fileList.length
        } 个文件, 请重新选择。`,
        '提示',
        {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false,
          center: true
        }
      ).then(() => { })
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
    display: flex;
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
