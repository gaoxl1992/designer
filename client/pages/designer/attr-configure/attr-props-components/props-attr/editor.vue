<!--
 * @Description: 
 * @props: 
-->
<template>
  <div class="attr-rad-editor">
    <el-form-item label="标题">
      <el-input size="small"
                v-model="tempLabel"></el-input>
    </el-form-item>
    <el-form-item label="占位高度">
      <el-input-number v-model="tempEditor"
                       size="small"
                       @change="handleChange"
                       :min="100"></el-input-number>
      px
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'attr-rad-editor',
  props: {
    editor: {
      type: Number,
      default: 200
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempEditor: 200,
      tempLabel: ''
    }
  },
  mounted() {
    this.tempEditor = this.editor
    this.tempLabel = this.label
  },
  watch: {
    editor(val) {
      this.tempEditor = val
    },
    label(val) {
      this.tempLabel = val
    },
    tempLabel(val) {
      this.$emit('update:label', val)
    }
  },
  methods: {
    handleChange() {
      this.$emit('update:editor', this.tempEditor)
    }
  }
}
</script>