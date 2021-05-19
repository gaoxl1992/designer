// 设置下拉选项组件（内容模板设置-设置下拉控件的、报告信息设置-设置自定义域值下拉组件的下拉选项）
<template>
  <div class="set-sel-option">
    <p class="sel-type">
      <el-radio v-if="supportType.indexOf('multiply') > -1" v-model="selType" :disabled="disableSelType" @change="chgSelType" label="multiply">多选</el-radio>
      <el-radio v-if="supportType.indexOf('single') > -1" v-model="selType" :disabled="disableSelType" @change="chgSelType" label="single">单选</el-radio>
    </p>
    <!-- 下拉框选项设置 -->
    <p class="sel-list" v-if="options && options.length">
      <span class="sel-list-title">选项</span>
      <span class="sel-list-default">默认值</span>
    </p>
    <ul class="sel-option-list">
      <li v-for="(option, index) in options" :key="index">
        <i class="iconfont icondrag" draggable="true" @dragstart="onDragStart($event, index)" @dragover="onDragOver($event, index)" @drop="onDragEnd($event, index)"></i>
        <el-input maxlength='50' @change='chgOptionValue' v-model="option.value" size='mini' placeholder="请输入内容"></el-input>
        <el-checkbox @change='chgDefaultFlag' v-if='selType === "multiply"' v-model="option.defaultFlag"></el-checkbox>
        <el-radio @change='(val) => {chgDefaultFlag(val, index)}' :label="index + 1" v-else v-model="option.defaultFlag">{{''}}</el-radio>
        <i @click="delOptions(index, option.value)" class="iconfont iconclose"></i>
        <el-popover
          placement="top"
          width="160"
          :open-delay="500"
          trigger="hover">
          <ul>
            <li v-if="moreop.indexOf('addInput') > -1" class="pop-li" @click="addInput(index)">{{ option.addInput ? '移除' : '追加' }}输入框</li>
            <li v-if="moreop.indexOf('disabledOption') > -1" class="pop-li" @click="disabledOption(index)">{{ option.disabled ? '取消禁用' : '禁用选项' }}</li>
          </ul>
          <i class="iconfont iconmore2" slot="reference"></i>
        </el-popover>
      </li>
    </ul>
    <div class="add-option">
      <i @click="addOptions" class="iconfont iconplus-fill"></i><span @click="addOptions">添加选项</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SetSelOption',
  props: {
    selTypeParent: { // 父组件传入的单选、多选
      type: String,
      default: 'multiply'
    },
    disableSelType: { // 是否disabled选择类型
      type: Boolean,
      default: false
    },
    supportType: {
      type: Array,
      default: () => ['single', 'multiply']
    },
    optionsParent: { // 父组件传入的初始下拉选项
      type: Array,
      default: () => []
    },
    moreop: {
      type: Array,
      default: () => ['addInput', 'disabledOption']
    }
  },
  data () {
    return {
      selType: 'multiply', // multiply: 多选，single：单
      options: this.optionsParent || [],
      visible: false
    };
  },
  mounted () {
    this.options = this.optionsParent; // 下拉选项赋值
    this.selType = this.selTypeParent; // 单多选赋值
  },
  watch: {
    selTypeParent (val) {
      this.selType = val;
    },
    optionsParent: {
      handler (val) {
        this.options = val;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 追加输入框
    addInput (index) {
      this.options[index].addInput = !this.options[index].addInput
      this.$emit('chgSetOption', { options: this.options, selType: this.selType });
    },
    // 禁用选项
    disabledOption (index) {
      this.options[index].disabled = !this.options[index].disabled
      this.$emit('chgSetOption', { options: this.options, selType: this.selType });
    },
    // 获取设置的下拉信息
    getSelInfo () {
      let defaultValue = this.selType === 'single' ? '' : []; // 下拉的默认值
      let options = [];
      if (this.options && this.options.length) {
        this.options.forEach(cols => { // 处理设置的下拉默认值
          if (cols.defaultFlag) {
            if (this.selType === 'single') { // 单选
              defaultValue = cols.value;
            } else { // 多选
              if (cols.value) {
                defaultValue.push(cols.value);
              }
            }
          }
          if (cols.value) {
            options.push(JSON.parse(JSON.stringify(cols)));
          }
        });
      }
      return {
        selType: this.selType,
        options: [{
          value: '', // 选项值
          defaultFlag: false, // 是否默认值
        }].concat(options),
        default: defaultValue, // 下拉框默认值
      };
    },
    chgOptionValue () { // 改变下拉选项的值
      this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
    },
    chgSelType () { // 改变单双选
      if (this.options && this.options.length) { // 切换单双选清空默认值
        this.options.forEach(cols => {
          cols.defaultFlag = false;
        });
      }
      this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
    },
    chgDefaultFlag (val, chgIndex) { // 改变默认值
      if (this.selType === 'single' && val) { // 如果是单选且选中此选项为默认
        if (this.options && this.options.length) {
          this.options.forEach((cols, index) => {
            if (chgIndex !== index && (cols.defaultFlag || cols.defaultFlag === 0)) { // 取消此选项外的其他选项的默认状态
              cols.defaultFlag = false;
            }
          });
        }
      }
      this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
    },
    addOptions () { // 添加选项
      this.options.push({
        value: '', // 选项值
        defaultFlag: false, // 是否默认值
      });
      this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
    },
    delOptions (index, value) { // 删除选项
      if (value) {
        this.$confirm('确定删除此选项吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false // 不可通过点击遮罩关闭 MessageBox
        }).then(async () => {
          this.options.splice(index, 1);
          this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
        }).catch(() => {});
      } else {
        this.options.splice(index, 1);
        this.$emit('chgSetOption', { options: this.options, selType: this.selType });
      }
    },
    // 选项拖拽相关start
    onDragStart (e, index) { // 开始拖拽
      e.dataTransfer.setData('dragIndex', index);
    },
    onDragOver (e) { // 拖拽经过
      e.preventDefault();
    },
    onDragEnd (e, index) { // 拖拽结束
      e.preventDefault();
      let fromIndex = parseInt(e.dataTransfer.getData('dragIndex')); // 被拖拽的index
      let toIndex = index; // 要放置的index
      let fromItem = JSON.parse(JSON.stringify(this.options[fromIndex])); // 被拖拽的项目
      let topItem = JSON.parse(JSON.stringify(this.options[toIndex])); // 被放置的项目
      // 交换项目顺序
      this.$set(this.options, fromIndex, topItem);
      this.$set(this.options, toIndex, fromItem);
      this.$emit('chgSetOption', { options: this.options, selType: this.selType }); // 将设置的下拉信息返回给父组件
    },
    // 选项拖拽相关end
  }
};
</script>
<style lang="scss">
.set-sel-option {
  .sel-type {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 500;
    color: $font-color-base;
  }

  .sel-list {
    margin: 10px 0 10px 0;
    display: flex;
    padding-right: 10px;
    justify-content: space-between;
    font-size: 12px;

    .sel-list-title {
      font-weight: 500;
    }
    .sel-list-default {
      padding-right: 20px;
    }
  }

  .sel-option-list {
    li {
      font-size: 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid $border-color;

      .el-input {
        font-size: 14px;
        width: calc(100% - 55px);

        .el-input__inner {
          border-radius: 0;
          border: none;
          padding: 0 5px;
        }
      }

      .el-checkbox,
      .el-radio {
        margin-right: 5px;
      }

      .el-radio__label {
        padding: 0;
        font-size: 14px;
      }

      i {
        font-size: 12px;
        color: $font-color-base;
        cursor: pointer;
        padding-left: 5px;
        line-height: 14px;

        &:hover {
          color: $primary;
        }
      }

      .icondrag {
        font-size: 16px;
      }
    }
  }

  .add-option {
    margin-top: 10px;
    font-size: 12px;
    color: $font-color-base;

    i,
    span {
      cursor: pointer;
    }

    i {
      padding-right: 5px;
    }
  }
}
.pop-li {
  padding: 5px 2px;
  &:hover {
    color: $primary;
    background-color: $page-bg-deepcolor;
  }
}
</style>