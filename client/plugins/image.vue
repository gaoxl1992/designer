<!--
 * @Description: 图片组件
-->
<template>
  <div
    class="rad-image"
    :id="editorId"
    style="height: 100%; width: 100%; text-align:center"
  >
    <el-image
      v-if="pagetype !== 'preview'"
      :src="imageUrl"
      alt=""
      fit="contain"
    >
      <div
        slot="error"
        class="image-slot"
      >
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    <img
      v-else-if="imageUrl"
      :style="previewStyle"
      :src="imageUrl"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: 'RadImage',
  props: {
    image: {
      type: String,
      default: ''
    },
    type: {
      type: Boolean,
      default: false
    },
    file: {
      type: Array,
      default: () => []
    },
    pagetype: {
      type: String,
      default: ''
    },
    editorId: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      imageUrl: this.type ? this.file[0] : this.image,
      previewStyle: {}
    }
  },
  mounted () {
    let img = new Image();
    img.src = this.imageUrl;
    let width = img.width;
    let height = img.height;
    let imgParent = document.getElementById(this.editorId).parentElement;
    let { clientWidth, clientHeight } = imgParent;
    if ((width / height) > (clientWidth / clientHeight)) {
      this.previewStyle = {
        width: '100%',
        height: 'auto'
      };
    } else {
      this.previewStyle = {
        height: '100%',
        width: 'auto'
      };
    }
  },
  watch: {
    type (val) {
      if (val) {
        this.imageUrl = this.file[0]
      } else {
        this.imageUrl = this.image
      }
    },
    image (val) {
      if (!this.type) {
        this.imageUrl = val
      }
    },
    file (val) {
      if (this.type && val && val[0]) {
        this.imageUrl = val[0]
      }
    }
  }
}
</script>

<style lang="scss">
.rad-image {
  height: 100%;
  width: 100%;
  .el-image {
    width: 100%;
    height: 100%;
  }
  .image-slot {
    position: absolute;
    top: calc(50% - 25px);
    left: calc(50% - 25px);
  }
  .el-icon-picture-outline {
    font-size: 50px;
  }
}
</style>
