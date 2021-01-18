/*
 * @Author: gaoxl
 * @Date: 2020-12-19 13:51:27
 * @LastEditTime: 2021-01-14 16:27:57
 * @LastEditors: your name
 * @Description: 编辑器数据状态存储
 */
import {
  cloneDeep,
  merge
} from 'lodash'
import editorProjectConfig from '@client/config/DataModel'

const state = {
  // 当前编辑器编辑工程项目数据
  pageData: {},
  // 画板中选中的元素uuid
  activeElementUUID: '',
  // 多选时，选中元素的UUID列表
  activeElementsUUID: [],
  // 历史操作数据用于undo redo
  historyCache: [],
  // redo undo 指针
  currentHistoryIndex: -1,
  // 激活组件属性展开项
  activeAttrEditCollapse: ['1'],
  // 表格模版列表
  tableTpl: []
};
const actions = {
  /**
   * @description: 设置表格模版
   * @param {*}
   * @return {*}
   */
  setTableTpl({
    commit
  }, data) {
    commit('setTableTpl', data)
  },
  /**
   * @description: 初始化编辑项目数据
   * @param state
   * @param data
   */
  setPageData({
    commit
  }, data) {
    let pageData = data;
    if (!pageData) {
      pageData = editorProjectConfig.getPageConfig()
    }
    commit('setPageData', pageData);
  },
  /**
   * @description: 设置当前选中激活元素uuid
   * @param state
   * @param data
   */
  setActiveElementUUID({
    commit
  }, uuid) {
    commit('setActiveElementUUID', uuid);
  },
  /**
   * @description: 多选时激活uuid
   * @param {*} {commit}
   * @param {*} uuids
   */
  setActiveElementsUUID({
    commit
  }, uuids) {
    commit('setActiveElementsUUID', uuids)
  },
  /**
   * @description: 更新画布高度
   * @param {*} {commit}
   * @param {*} height
   */
  updateCanvasHeight({
    commit
  }, height) {
    commit('updateCanvasHeight', height)
  },
  /**
   * @description: 更新页面
   * @param {*}
   * @return {*}
   */
  updatePages({
    commit
  }, pages) {
    commit('updatePages', pages)
  },
  /**
   * @description: 更新画布参考线
   * @param {*}
   * @return {*}
   */
  updateGuideLine({
    commit
  }, image) {
    commit('updateGuideLine', image)
  },
  /**
   * @description: 画布参考线间距
   * @param {*}
   * @return {*}
   */
  updateBackSize({
    commit
  }, size) {
    commit('updateBackSize', size)
  },
  /**
   * @description: 添加元素
   * @param commit
   * @param data
   */
  addElement({
    commit,
    state
  }, elData) {
    let data = editorProjectConfig.getElementConfig(elData, {
      zIndex: state.pageData.elements.length + 1
    })
    commit('addElement', data);
    commit('setActiveElementUUID', data.uuid)
    commit('setActiveElementsUUID', [])
    commit('addHistoryCache')
  },
  /**
   * @description: 元素指令， 用于结束针对元素修改相关指令
   * @param dispatch
   * @param type
   * @param data
   */
  elementCommand({
    commit,
    dispatch,
    state
  }, command) {
    let elData = getters.activeElement(state)
    switch (command) {
      case 'copy':
        dispatch('copyElement', elData)
        break;
      case 'delete':
        dispatch('deleteElement', elData.uuid)
        break;
      case 'fontA+':
        dispatch('resetElementCommonStyle', {
          fontSize: elData.commonStyle.fontSize + 1
        })
        break;
      case 'fontA-':
        dispatch('resetElementCommonStyle', {
          fontSize: elData.commonStyle.fontSize - 1
        })
        break;
      case 'fontB':
        dispatch('resetElementCommonStyle', {
          fontWeight: elData.commonStyle.fontWeight === 'bold' ? 'normal' : 'bold'
        })
        break;
      case 'layerUp':
        commit('resetElementZIndex', {
          uuid: elData.uuid,
          type: 'layerUp'
        })
        commit('addHistoryCache')
        break;
      case 'layerDown':
        commit('resetElementZIndex', {
          uuid: elData.uuid,
          type: 'layerDown'
        })
        commit('addHistoryCache')
        break;
      case 'layerTop':
        commit('resetElementZIndex', {
          uuid: elData.uuid,
          type: 'layerTop'
        })
        commit('addHistoryCache')
        break;
      case 'layerBottom':
        commit('resetElementZIndex', {
          uuid: elData.uuid,
          type: 'layerBottom'
        })
        commit('addHistoryCache')
        break;
      default:
        break;
    }
  },
  /**
   * @description: 导入模版对元素的处理
   * @param {*} {
   * 		state,
   * 		commit
   * 	}
   * @param {*} elData
   */
  importElement({
    state,
    commit
  }, elData) {
    let copyOrignData = elData ? elData : getters.activeElement(state)
    let data = editorProjectConfig.copyElement(copyOrignData, {
      zIndex: state.pageData.elements.length
    }, 'import')
    commit('addElement', data);
    commit('setActiveElementUUID', data.uuid)
    commit('setActiveElementsUUID', [])
    commit('addHistoryCache')
  },
  /**
   * @description: 复制控件
   * @param {*}
   * @return {*}
   */
  copyElement({
    state,
    commit
  }, elData) {
    let copyOrignData = elData ? elData : getters.activeElement(state)
    let data = editorProjectConfig.copyElement(copyOrignData, {
      zIndex: state.pageData.elements.length + 1
    })
    commit('addElement', data);
    commit('setActiveElementUUID', data.uuid)
    commit('setActiveElementsUUID', [])
    commit('addHistoryCache')
  },
  /**
   * @description: 删除元素
   * @param {*} {
   * 		state,
   * 		commit
   * 	}
   * @param {*} uuid
   */
  deleteElement({
    state,
    commit
  }, uuid) {
    // 如果删除选中元素则取消元素选中
    if (uuid === state.activeElementUUID) {
      commit('setActiveElementUUID', '')
      commit('setActiveElementsUUID', [])
    }
    // 先将页面元素zIndex 重置下再删除元素
    commit('resetElementZIndex', {
      uuid: uuid,
      type: 'set0'
    })

    commit('deleteElement', uuid)
    commit('addHistoryCache')
  },
  /**
   * @description: 重置元素的公共样式
   * @param {*} {
   * 		commit
   * 	}
   * @param {*} style
   */
  resetElementCommonStyle({
    commit
  }, style) {
    commit('resetElementCommonStyle', style)
    commit('addHistoryCache')
  },
  /**
   * @description: 记入历史纪录
   * @param commit
   * @param index 插入到index后
   */
  addHistoryCache({
    commit
  }) {
    commit('addHistoryCache')
  },
  /**
   * @description: 撤销重做
   * @param {*} {
   * 		commit,
   * 		state
   * 	}
   * @return {*} 
   */
  editorUndo({
    commit,
    state
  }) {
    if (!getters.canUndo(state)) {
      return;
    }
    const prevState = state.historyCache[state.currentHistoryIndex - 1]
    commit('relapceEditorState', cloneDeep(prevState))
    commit('editorUndo')
  },
  /**
   * @description: 重做
   * @param {*} {
   * 		commit
   * 	}
   * @return {*} 
   */
  editorRedo({
    commit
  }) {
    if (!getters.canRedo(state)) {
      return;
    }
    const prevState = state.historyCache[state.currentHistoryIndex + 1]
    commit('relapceEditorState', cloneDeep(prevState))
    commit('editorRedo')
  }
};
const mutations = {
  setTableTpl(state, data) {
    state.tableTpl = JSON.parse(JSON.stringify(data))
  },
  setPageData(state, data) {
    state.pageData = data;
  },
  setActiveElementUUID(state, data) {
    state.activeElementUUID = data;
  },
  setActiveElementsUUID(state, data) {
    state.activeElementsUUID = data;
  },
  updateCanvasHeight(state, height) {
    state.pageData.height = height
  },
  updatePages(state, pages) {
    state.pageData.totalPages = pages
  },
  updateGuideLine(state, image) {
    state.pageData.backgroundImage = image
  },
  updateBackSize(state, size) {
    state.pageData.backgroundSize = size
  },
  addElement(state, elData) {
    state.pageData.elements.push(elData);
  },
  /**
   * 往画板添加元素
   * @param state
   * @param elData  activeElementIndex
   */
  deleteElement(state, uuid) {
    let elementIndex = state.pageData.elements.findIndex(v => {
      return v.uuid === uuid
    })
    state.pageData.elements.splice(elementIndex, 1)
  },
  /**
   * 重置元素样式，
   * @param commit
   * @param uuid
   * @param styleObject
   */
  resetElementCommonStyle(state, style) {
    let activeElement = getters.activeElement(state)
    activeElement.commonStyle = merge(activeElement.commonStyle, style)
  },

  /**
   * 改变元素zIndex
   * @param state
   * @param uuid
   * @param type layerUp上一层，layerDown下一层，layerTop置顶， layerBottom置底
   */
  resetElementZIndex(state, {
    uuid,
    type
  }) {
    uuid = uuid || state.activeElementUUID;
    let currentElement = state.pageData.elements.find(v => {
      return v.uuid === uuid
    });
    let itemZIndex = currentElement.commonStyle.zIndex;
    let maxIndex = state.pageData.elements.length;
    let mminIndex = 1;
    let zIndexDirc = {
      layerUp: Math.min(itemZIndex + 1, maxIndex),
      layerDown: Math.max(itemZIndex - 1, mminIndex),
      layerTop: maxIndex,
      layerBottom: mminIndex,
      set0: 0
    }
    if (zIndexDirc[type] === undefined) return;
    let currentZIndex = zIndexDirc[type]
    currentElement.commonStyle.zIndex = currentZIndex;
    state.pageData.elements.forEach(item => {
      if (uuid === item.uuid) return;
      // 上面一位zIndex减一
      if (type === 'layerUp' && item.commonStyle.zIndex === currentZIndex) {
        item.commonStyle.zIndex--
      }
      // 下面元素zIdex加一
      if (type === 'layerDown' && item.commonStyle.zIndex === currentZIndex) {
        item.commonStyle.zIndex++
      }
      // 目标元素zIndex 以上的都减一
      if (type === 'layerTop' && item.commonStyle.zIndex > itemZIndex) {
        item.commonStyle.zIndex--
      }
      // 目标元素zIndex以下的都加一
      if ((type === 'layerBottom' || type === 'set0') && item.commonStyle.zIndex < itemZIndex) {
        item.commonStyle.zIndex++
      }
    })
  },

  // ================================历史纪录========================================
  /**
   * 新增一条历史纪录
   * @param state
   */
  addHistoryCache(state) {
    if (state.currentHistoryIndex + 1 < state.historyCache.length) {
      state.historyCache.splice(state.currentHistoryIndex + 1)
    }
    state.historyCache.push({
      pageData: cloneDeep(state.pageData),
      activeElementUUID: state.activeElementUUID
    })
    // 限制undo 纪录步数，最多支持100步操作undo
    state.historyCache.splice(100)
    state.currentHistoryIndex++
  },
  /**
   * 重做
   * @param state
   */
  editorUndo(state) {
    state.currentHistoryIndex--
  },
  /**
   * 撤销
   * @param state
   */
  editorRedo(state) {
    state.currentHistoryIndex++
  },
  /**
   * 更新编辑器项目数据，从history中拿数据替换
   * @param state
   * @param data
   */
  relapceEditorState(state, data) {
    state.pageData = cloneDeep(data.pageData)
    state.activeElementUUID = data.activeElementUUID
  },
  /**
   * 设置编辑属性折叠面板展开收起状态
   * @param state
   * @param data
   */
  updateActiveAttrEditCollapse(state, data) {
    state.activeAttrEditCollapse = [...data];
  }
};
const getters = {
  /**
   * 当前选中的页面index
   * @param state
   * @returns {*}
   */
  activeElementIndex(state) {
    return state.pageData.elements.findIndex(v => {
      return v.uuid === state.activeElementUUID
    })
  },
  /**
   * 当前选中元素
   */
  activeElement() {
    // 如果不存在页面返回-1
    return state.pageData.elements.find(v => {
      return v.uuid === state.activeElementUUID
    })
  },
  canUndo(state) {
    return state.currentHistoryIndex > 0
  },
  canRedo(state) {
    return state.historyCache.length > state.currentHistoryIndex + 1
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}