const configDict = {
  development: {
    baseURL: 'http://localhost:4000'
  },
  production: {
    baseURL: 'http://localhost:4000'
  }
}

const currentConfigKey = process.env.NODE_ENV
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'development'

const configObj = {
  isDevelop: (isDev || isTest),
  ...configDict[currentConfigKey]
}

if (window.innerWidth) {
  configObj.canvasH5Width = window.innerWidth - 1020;
} else if ((document.body) && (document.body.clientWidth)) {
  configObj.canvasH5Width = document.body.clientWidth - 1020;
}

let width = configObj.canvasH5Width > 700 ? configObj.canvasH5Width : 700

configObj.canvasH5Height = width * 297 / 210;

export default configObj