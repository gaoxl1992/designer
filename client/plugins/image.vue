<!--
 * @Description: 图片组件
-->
<template>
  <div
    class="rad-image"
    style="height: 100%; width: 100%"
  >
    <el-image
      v-if="pagetype !== 'preview'"
      :src="imageUrl"
      alt=""
      fit="fit"
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
      style="height: 100%; width: 100%"
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
    }
  },
  data () {
    return {
      imageUrl: this.type ? this.file[0] : this.image
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
    border: 1px solid rgb(185, 179, 179);
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
