<!--
 * @Description: 表格列表组件
 * @props:
 *   tableTplList 表格模版列表 Array
-->
<template>
  <div class="tpl-list">
    <p>表格模版列表(双击重新编辑)</p>
    <div
      class="tpl-list-item"
      v-for="(item, index) in tableTplList"
      :key="item.id"
    >
      <div class="tpl-item">
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.title"
          placement="top-start"
        >
          <div
            class="tpl-item-name"
            @dblclick="editTableTpl(item, index)"
          >{{item.title}}</div>
        </el-tooltip>
        <i
          class="el-icon-close"
          @click="deleteTableTpl(index, item)"
        ></i>
      </div>
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
    deleteTableTpl (index, item) {
      this.$emit('deleteTableTpl', {
        index,
        id: item.id
      })
    },
    /**
     * @description: 编辑模版
     * @param {*} item
     * @return {*}
     */
    editTableTpl (item, index) {
      this.$emit('editTableTpl', {
        id: item.id,
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
  height: calc(100% - 38px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;
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
      width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>