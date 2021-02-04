// 页面基础配置Modal
import {
  createUUID,
  deepClone
} from '../utils/mUtils'
import {
  cloneDeep,
  merge
} from 'lodash';
import $config from './index';

// 表单元素配置信息字段
let elementConfig = {
  elName: '', // 组件名
  isPlaceholder: false, // 占位控件标示
  hasThreshold: true, // 组件类别默认有阈值
  threshold: '', // 控件阈值
  hideOnPrint: false, // 组件是否打印隐藏
  title: '', // 组件中文名
  commonStyle: { // 公共样式
    position: 'absolute',
    width: $config.canvasH5Width > 700 ? $config.canvasH5Width - 20 : 680,
    height: 40,
    top: 200,
    left: 0,
    rotate: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: '',
    borderStyle: 'solid',
    borderRadius: 0,
    fontSize: 16,
    fontFamily: 'Microsoft YaHei',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0,
    textAlign: 'left',
    color: '#000000',
    backgroundColor: '',
    backgroundImage: '',
    backgroundSize: 'cover',
    opacity: 1,
    zIndex: 1,
    fontStyle: false
  },
  propsValue: {}, // 属性参数
  value: '', // 绑定值
  activeElement: '',
  script: ''
}

// 页面配置信息字段
let pageConfig = {
  elements: [],
  fixedHeader: {
    openFixed: false,
    height: 50,
    page: '0'
  },
  fixedFooter: {
    openFixed: false,
    height: 50,
    page: '0'
  },
  name: '',
  pageType: 'a4',
  spCharacters: [],
  domainList: [],
  script: '',
  customHeight: 297,
  customWidth: 210,
  totalPages: 1,
  backgroundSize: 20,
  width: $config.canvasH5Width > 700 ? $config.canvasH5Width : 700,
  height: $config.canvasH5Height,
  backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZAgMAAAC5h23wAAAAAXNSR0IB2cksfwAAAAlQTFRF9fX18PDwAAAABQ8/pgAAAAN0Uk5T/yIA41y2EwAAABhJREFUeJxjYIAC0VAQcGCQWgUCDUONBgDH8Fwzu33LswAAAABJRU5ErkJggg==")'
}

/**
 * 初始化控件配置
 *
 * @param {*} element
 * @param {*} [extendStyle={}]
 * @return {*} 
 */
let getElementConfig = function (element, extendStyle = {}) {
  let elementData = cloneDeep(element)
  let elementConfigData = cloneDeep(elementConfig)
  let config = {
    uuid: createUUID(),
    ...elementConfigData,
    elName: elementData.elName,
    isPlaceholder: elementData.isPlaceholder,
    hideOnPrint: elementData.hideOnPrint,
    threshold: elementData.threshold,
    hasThreshold: elementData.hasThreshold,
    title: elementData.title,
    propsValue: deepClone(elementData.needProps || {})
  }
  // 样式
  config.commonStyle = merge(config.commonStyle, elementData.defaultStyle)
  config.commonStyle = merge(config.commonStyle, extendStyle)
  return config;
}

/**
 * 处理控件复制/导入
 *
 * @param {*} element
 * @param {*} [extendStyle={}]
 * @return {*} 
 */
let copyElement = function (element, extendStyle = {}, op = '') {
  element = cloneDeep(element)
  element.uuid = createUUID();
  element.commonStyle = merge(element.commonStyle, extendStyle)
  // 复制控件加上一点偏移量，以作区分
  if (op !== 'import') {
    element.commonStyle.top = element.commonStyle.top + 10
    element.commonStyle.left = element.commonStyle.left + 10
  }
  return element
}

/**
 * 初始化页面配置
 *
 * @return {*} 
 */
let getPageConfig = function () {
  return {
    uuid: createUUID(),
    ...cloneDeep(pageConfig)
  }
}

/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
let getCommonStyle = function (styleObj, scalingRatio = 1) {
  let needUnitStr = ['width', 'height', 'top', 'left', 'paddingTop', 'paddingLeft', 'paddingRight', 'paddingBottom', 'marginTop', 'marginLeft', 'marginRight', 'marginBottom', 'borderWidth', 'fontSize', 'borderRadius', 'letterSpacing']
  let style = {}

  for (let key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = (styleObj[key] * scalingRatio) + 'px'
    } else {
      style[key] = styleObj[key]
    }

    if (key === 'fontStyle') {
      style[key] = styleObj[key] ? 'italic' : 'normal'
    }
  }
  style.transform = `rotate(${style.rotate}deg)`
  style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : '';
  return style;
}

export default {
  elementConfig,
  pageConfig,
  getElementConfig,
  getPageConfig,
  copyElement,
  getCommonStyle
}