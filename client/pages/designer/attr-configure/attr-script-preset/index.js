let stydyData = `检查信息(_business.studyData)
  accurate
  applyDepartment
  applyDoctor
  assistant
  backupField1
  backupField2
  backupField3
  backupField4
  backupField5
  backupField6
  bodyPartGroupName
  bodyPartName
  cardId
  clinicalInfo
  crises
  crisisFlag
  departmentId
  deptStudyId
  deviceName
  deviceTypeName
  diagnostician
  disableFlag
  doctorId1
  doctorId2
  doctorId3
  doctorId4
  doctorId5
  doctorId6
  doctorTime1
  doctorTime2
  doctorTime3
  doctorTime4
  doctorTime5
  doctorTime6
  emergencyFlag
  favoriteFlag
  filmState
  followUpFlag
  followUpState
  followUpStateValue
  hisApplicationId
  imageCount
  lockFlag
  lockUser
  nakedEyeSee
  operateTime
  operator
  patientAddress
  patientAge
  patientAgeUnit
  patientBirthday
  patientEName
  patientFolk
  patientHeight
  patientIdNumber
  patientInPatientId
  patientName
  patientOutPatientId
  patientPhoneNumber
  patientSex
  patientSickBed
  patientSickRoom
  patientTypeId
  patientTypeName
  patientWeight
  performingPhysicianName
  positiveFlag
  queueName
  registerTime
  reportAdvice
  reportDesc
  reportDiagnose
  reportPrintCount
  reportTime
  reviewer
  rptPrintFlag
  societyId
  studyComment
  studyDesc
  studyDescribe
  studyId
  studyMethodName
  studyStatus
  studyStatusValue
  studyTime
  techRemarkFlag
  technician
  totalFee
  typist
  vipFlag
  workingCompany
  xeguid
`

let pageData = `报告信息(_report.pageData)
  elements: [], // 页面内的组件
  fixedHeader: { // 页眉
    openFixed // 是否开启
    height // 高度-毫米
    page // 分页格式 第x页 或 第x/n页
  },
  fixedFooter: { // 页脚
    openFixed 
    height
    page
  },
  pageType: 'a4', // 纸张类型
  customHeight: 297, // 纸张大小 毫米
  customWidth: 210,
  width // 实际渲染宽度 px
  height // 实际渲染高度 px
`

let curComp = `当前控件属性(_report.currentComp)
  elName // 组件名
  threshold // 控件阈值
  hideOnPrint  // 组件是否打印隐藏
  title // 组件中文名
  commonStyle: { // 组件样式
    width // 宽度
    height // 高度
    top // 距离页面主体顶部的距离 mm
    left // 距离页面主体左边距的距离 mm
    rotate // 旋转
    // 内边距
    paddingTop
    paddingLeft
    paddingRight
    paddingBottom
    // 外边距
    marginTop
    marginLeft
    marginRight
    marginBottom
    // 边框
    borderWidth
    borderColor
    borderStyle
    borderRadius
    // 字体
    fontSize
    fontFamily
    fontWeight
    lineHeight // 行高
    textAlign // 文字对齐 'left' 'center' 'right'
    color // 颜色
    backgroundColor // 背景色
    backgroundImage // 背景图
    opacity // 透明度
    zIndex // 层级
    fontStyle // 是否斜体
  },
  value: '', // 当前组件的值
  propsValue: { // 组件预设属性
`

let elementsAttr = `_report.elements['阈值']，可访问属性同'_report.currentComp'`

let scriptStr = `json格式包含以下任意一个或多个方法：
{
  // 页面初始化
  "initPage": "if(_business.studyData.crisisFlag===0){console.log('----')}",
  // 点击组件
  "onclick": "if(_business.studyData.crisisFlag===0){console.log('----')}",
  // 值变化
  "onchange": "if(_business.studyData.crisisFlag===0){console.log('----')}"
}
`

export {
  scriptStr,
  stydyData,
  pageData,
  curComp,
  elementsAttr
}