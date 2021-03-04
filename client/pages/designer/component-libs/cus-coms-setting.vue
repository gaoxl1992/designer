<template>
  <el-dialog :visible="dialogVisible"
             @close="cancel">
    <div class="cus-comps-setting-title"
         slot="title">
      常用组件
    </div>
    <el-form class="comps-setting">
      <el-form-item v-for="(item, index) in compsList"
                    :key="index"
                    class="clearfix">
        <div class="cus-components-libs-title">
          <div>{{ item.category }}</div>
        </div>
        <span class="cus-components-lib-item"
              v-for="(el, i) in item.domains"
              :key="i">
          <el-checkbox :value="el.display" @change="changeCheck(el, i, index)">
            {{el.name}}
          </el-checkbox>
        </span>
      </el-form-item>
    </el-form>
    <span class="btn-group"
          slot="footer">
      <el-button @click="confirm"
                 type="primary"
                 size="mini">确定</el-button>
      <el-button @click="cancel"
                 size="mini">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import bus from '@/utils/bus'
export default {
  name: 'CusCompsSetting',
  props: {
    customComps: {
      type: Array,
      default: () => []
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      compsList: () => [],
      cusNotDisplayComps: () => []
    }
  },
  created () {
    this.cusNotDisplayComps = []
    this.compsList = JSON.parse(JSON.stringify(this.customComps)) || []
    this.compsList.forEach((category) => {
      category.domains.forEach((comp) => {
        if (comp.hidden) {
          this.cusNotDisplayComps.push(comp.option)
        }
        comp.display = !comp.hidden
      })
    })
  },
  methods: {
    changeCheck (el, i, index) {
      el.display = !el.display
      let cat = this.compsList[index]
      this.$set(cat, i, el);
      this.$set(this.compsList, index, cat)
    },
    /**
     * @description: 保存组件
     * @param {*}
     * @return {*}
     */
    confirm () {
      let cusNotDisplayCompsNew = this.getNewCusNotDisplayComps()
      
      if (JSON.stringify(this.cusNotDisplayComps) !== JSON.stringify(cusNotDisplayCompsNew)) {
        bus.$emit('saveCustomNotDisplayComps', cusNotDisplayCompsNew)
      }
      this.$emit('close')
    },
    getNewCusNotDisplayComps () {
      let cusNotDisplayCompsNew = []
      this.compsList.forEach((category) => {
        category.domains.forEach((comp) => {
          if (comp.display === false) {
            cusNotDisplayCompsNew.push(comp.option)
          }
        })
      })
      return cusNotDisplayCompsNew
    },
    /**
     * @description: 取消操作
     * @param {*}
     * @return {*}
     */
    cancel () {
      let cusNotDisplayCompsNew = this.getNewCusNotDisplayComps()
      if (JSON.stringify(this.cusNotDisplayComps) !== JSON.stringify(cusNotDisplayCompsNew)) {
        this.$confirm('检测到您有未保存的变更，是否关闭？', '确认', {
          confirmButtonText: '关闭',
          cancelButtonText: '保存并关闭'
        }).then(() => {
          this.$emit('close')
        }).catch(() => {
          bus.$emit('saveCustomNotDisplayComps', cusNotDisplayCompsNew)
          this.$emit('close')
        })
      } else {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss">
.el-divider--horizontal {
  margin: 16px 0;
}
.cus-components-libs-title {
  line-height: 22px;
}
.cus-components-lib-item {
  padding-right: 10px;
  position: relative;
  .el-checkbox {
    margin-right: 0px;
  }
}
.btn-group {
  text-align: right;
}
.pop-btn-group {
  float: right;
}
</style>