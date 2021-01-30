<!--
 * @Description: 富文本
-->
<template>
  <el-form
    class="attr-rad-editor"
    inline
  >
    <el-form-item label="标题">
      <el-input
        size="mini"
        clearable
        v-model="tempLabel"
      ></el-input>
    </el-form-item>
    <el-form-item label="占位高度">
      <el-input-number
        v-model="tempEditor"
        size="mini"
        @change="handleChange"
        :min="100"
      ></el-input-number>
      px
    </el-form-item>
    <el-form-item label="预设富文本样式">
      <div class="attr-edit-wrapper">
        <div class="attr-item-edit-input sel-width">
          <el-select
            size="mini"
            v-model="fontFamilyTemp"
            placeholder="请选择"
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
            v-model="fontSizeTemp"
            controls-position="right"
            :min="0"
          />
          <div class="attr-item-edit-input-des">字号</div>
        </div>
        <div class="ml attr-item-edit-input">
          <el-input-number
            size="mini"
            v-model="fontWeightTemp"
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
            v-model="colorTemp"
          ></el-color-picker>
        </div>
        <div class="ml attr-item-edit-input">
          <el-checkbox v-model="fontStyleTemp">
            <span>A</span>
          </el-checkbox>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { fontFamilyList } from '@/config/attr-config'
export default {
  name: 'attr-rad-editor',
  props: {
    editor: {
      type: Number
    },
    label: {
      type: String
    },
    fontStyle: {
      type: String
    },
    color: {
      type: String
    },
    fontWeight: {
      type: Number
    },
    fontSize: {
      type: Number
    },
    fontFamily: {
      type: String
    }
  },
  data () {
    return {
      tempEditor: this.editor || 200,
      tempLabel: this.label || '',
      fontFamilyList,
      fontStyleTemp: this.fontStyle === 'italic' ? true : false,
      colorTemp: this.color || '#000',
      fontWeightTemp: this.fontWeight || 500,
      fontSizeTemp: this.fontSize || 14,
      fontFamilyTemp: this.fontFamily || 'Microsoft YaHei'
    }
  },
  watch: {
    tempLabel (val) {
      this.$emit('update:label', val)
    },
    fontStyleTemp (val) {
      this.$emit('update:fontStyle', val ? 'italic' : 'normal')
    },
    colorTemp (val) {
      console.log(val)
      this.$emit('update:color', val)
    },
    fontWeightTemp (val) {
      this.$emit('update:fontWeight', val)
    },
    fontSizeTemp (val) {
      this.$emit('update:fontSize', val)
    },
    fontFamilyTemp (val) {
      this.$emit('update:fontFamily', val)
    }
  },
  methods: {
    handleChange () {
      this.$emit('update:editor', this.tempEditor)
    }
  }
}
</script>
<style lang="scss">
.attr-edit-wrapper {
  display: flex;
  width: 100%;
  text-align: center;
  .attr-item-title {
    text-align: left;
    min-width: 78px;
    font-size: 14px;
    color: #161616;
  }
  .sel-width {
    min-width: 95px;
  }
  .attr-item-edit-input {
    &.ml {
      margin-left: 5px;
      flex: 1;
    }
  }
  .ita {
    font-style: italic;
  }
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
  .attr-item-edit-input-des {
    text-align: center;
    line-height: 1;
    margin-top: 2px;
    font-size: 12px;
    color: $gray;
  }
}
</style>