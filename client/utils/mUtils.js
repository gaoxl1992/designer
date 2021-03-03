/**
 * @description: 生成uuid方法
 * @param {*}
 * @return {*}
 */
export const createUUID = () => {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

/**
 * @description 对象深拷贝
 * @param {*} obj 拷贝对象(object or array)
 * @param {*} cache 缓存数组
 */
export const deepClone = (obj, cache = []) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  // 如果传入的对象与缓存的相等, 则递归结束, 这样防止循环
  const hit = cache.filter(c => c.original === obj)[0]
  if (hit) {
    return hit.copy
  }

  const copy = Array.isArray(obj) ? [] : {}
  // 将copy首先放入cache, 因为我们需要在递归deepCopy的时候引用它
  cache.push({
    original: obj,
    copy
  })
  Object.keys(obj).forEach(key => {
    copy[key] = deepClone(obj[key], cache)
  })

  return copy
}

export const dealWithScript = (element, scriptType, pageData) => {
  // 将报告页面主体挂载到window上，用于脚本灵活控制页面或组件
  window.report = window.report || {}
  window.report.pageData = pageData
  // 操作到哪个组件 currentComp就是哪个组件
  window.report.currentComp = element

  if (!element.script) {
    return
  }
  let script = JSON.parse(element.script)

  // 如果包含初始化脚本
  let scriptStr = script[scriptType]
  if (scriptStr) {
    scriptStr = scriptStr.replace(/_report/g, 'window.report').replace(/_business/g, 'window.business')
    let fun = new Function(`return function(){${scriptStr}}`)()
    fun()
  }
}

/**
 * 取出中括号内的内容
 * @param text
 * @returns {string}
 */
export function getBracketStr(text) {
  let result = ''
  if (!text) {
    return result
  }
  let regex = /\{(.+?)\}/g;
  let options = text.match(regex)
  if (options && options[0]) {
    options.forEach((option) => {
      let inner = option.replace('{', '').replace('}', '')
      // 如果业务中已将对应参数挂载到window上，则替换实际值
      if (window.business && window.business.studyData && window.business.studyData[inner]) {
        text = text.replace(option, window.business.studyData[inner])
      }
    })
  }

  result = text
  return result
}