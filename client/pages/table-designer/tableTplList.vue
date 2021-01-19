<!--
 * @Description: 表格列表组件
 * @props:
 *   tableTplList 表格模版列表 Array
-->
<template>
  <div class="tpl-list">
    <p>表格模版列表(双击重新编辑)</p>
    <div class="tpl-item"
         v-for="(item, index) in tableTplList"
         :key="item.id">
      <el-tooltip class="item"
                  effect="dark"
                  :content="item.name"
                  placement="top-start">
        <div class="tpl-item-name"
             @dblclick="editTableTpl(item, index)">{{item.name}}</div>
      </el-tooltip>
      <i class="el-icon-close"
         @click="deleteTableTpl(index)"></i>
    </div>
    <div v-if="!tableTplList || tableTplList.length === 0">暂无模版</div>
  </div>
</template>
<script>
export default {
  name: 'TableTplList',
  props: {
    tableTplList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    /**
     * @description: 删除表格模版
     * @param {*} index
     * @return {*}
     */
    deleteTableTpl(index) {
      this.$emit('deleteTableTpl', index)
    },
    /**
     * @description: 编辑模版
     * @param {*} item
     * @return {*}
     */
    editTableTpl(item, index) {
      this.$emit('editTableTpl', {
        rels: item.rels,
        tpl: item.tpl,
        name: item.name,
        index
      })
    }
  }
}
</script>
<style lang="scss">
.tpl-list {
  width: 280px;
  padding: 10px;
  p {
    padding: 10px 0;
    font-weight: 500;
  }
  .tpl-item {
    padding: 10px 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .tpl-item-name {
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>