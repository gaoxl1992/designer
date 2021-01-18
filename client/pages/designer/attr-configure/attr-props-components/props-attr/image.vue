<template>
  <div class="attr-rad-image">
    <el-form-item>
      <el-switch v-model="tempType"
                 active-text="本地图片"
                 inactive-text="网络图片">
      </el-switch>
    </el-form-item>
    <el-form-item v-if="!tempType"
                  label="图片地址">
      <el-input type="text"
                placeholder="请输入图片地址"
                v-model="tempImage">
      </el-input>
    </el-form-item>
    <el-form-item v-else>
      <div class="upload-pic">
        <template v-if="tempFile">
          <el-image :src="tempFile"
                    alt=""
                    fit="fit" />
          <input accept="image/jpg,image/png"
                 class="upload-pic-input ab"
                 type="file"
                 ref="input_file"
                 @change="fileChange" />
        </template>
        <template v-else>
          <input accept="image/jpg,image/png"
                 class="upload-pic-input"
                 type="file"
                 ref="input_file"
                 @change="fileChange" />
          <i class="el-icon-plus"></i>
        </template>
      </div>
      <p class="reupload"
         v-if="tempFile">点击图片区域重新选择</p>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-image',
  props: {
    image: {
      type: String,
      default: ''
    },
    type: Boolean,
    file: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tempImage: '',
      tempType: false,
      tempFile: ''
    }
  },
  mounted() {
    this.tempImage = this.image
    this.tempType = this.type
    this.tempFile = this.file[0]
  },
  methods: {
    fileChange(e) {
      let file = e.target.files[0]
      let imgSrc = []
      let reader = new FileReader()
      reader.onload = (value) => {
        imgSrc.push(value.target.result)
      }
      reader.readAsDataURL(file)
      this.$emit('update:file', imgSrc)
    }
  },
  watch: {
    file(val) {
      this.tempFile = val[0]
    },
    type(val) {
      this.tempType = val
    },
    image(val) {
      this.tempImage = val
    },
    tempImage(val) {
      this.$emit('update:image', val)
    },
    tempType(val) {
      this.$emit('update:type', val)
    }
  }
}
</script>
<style lang="scss">
.el-upload-dragger {
  background-color: transparent;
}
.el-upload,
.el-upload-dragger {
  width: 100%;
}
.upload-pic {
  height: 100px;
  width: 100px;
  border: 1px solid #b9b3b3;
}
.upload-pic-input {
  opacity: 0;
  z-index: 2;
  position: relative;
  height: 100px;
  bottom: 10px;
}
.attr-rad-image {
  .el-icon-plus {
    position: absolute;
    bottom: 35px;
    left: 35px;
    font-size: 30px;
    z-index: 1;
  }
}
.ab {
  position: absolute;
  bottom: 0px;
  height: 100px;
  left: -10px;
}
.reupload {
  left: 120px;
  position: absolute;
  bottom: 30px;
}
</style>