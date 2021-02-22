<!--
 * @Description: 设计器主入口
-->
<template>
  <div class="page-layout">
    <!-- 入口tab -->
    <div
      id="page-header"
      class="page-layout-header"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(value, key) in tabs"
          :key="key"
          :label="value"
          :name="key"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 页面操作区 -->
    <div class="page-layout-ops">
      <template v-for="(value, key) in ops">
        <div
          :key="key"
          v-if="activeName === key"
        >
          <el-button
            v-for="(v, k) in value"
            :key="k"
            @click="v.clickFn"
            type="primary"
            size="mini"
          >{{ v.label }}</el-button>
        </div>
      </template>
    </div>
    <!-- 页面主题 -->
    <keep-alive>
      <component
        :is="activeName"
        :tableTplList="tpls"
        @saveEdit="saveTable"
        @deleteTableTpl="deleteTableTpl"
        :customComps="customComp"
        :tpls="tpls"
        @updateSpChars="updateSpChars"
        @saveEditor="saveEditedPage"
        :tplStr="pageTpl"
        @saveDesignerData="saveDesignerData"
        :unableEdit="true"
        :ref="activeName"
        :style="{'overflow: auto': activeName === 'preview'}"
      ></component>
    </keep-alive>
  </div>
</template>
<script>
import bus from '@/utils/bus'
import { tabs, ops } from './lay-config'
import { mapState } from 'vuex'
import TableDesigner from './table-designer/index.js'
import Designer from './designer/index.js'
import Editor from './editor/index.js'
import Preview from './preview/index.js'

export default {
  data () {
    return {
      activeName: 'designer',
      pageDataHis: {},
      customComp: () => [],
      tpls: () => [],
      pageTpl: '',
      tabs,
      ops: ops(this)
    }
  },
  components: {
    TableDesigner,
    Designer,
    Editor,
    Preview
  },
  computed: {
    ...mapState({
      pageData: (state) => state.editor.pageData
    })
  },
  created () {
    // 模拟检查数据，塞到window下
    window.mockData = {
      attr1: 4,
      attr2: 6,
      attr3: 'abcdefg',
      attr4: 5
    }
    // 定制组件数据，首次通过mock存入localstorage，模拟数据库存储规则
    this.customComp = [
      {
        "category": "编号",
        "domains": [
          {
            "option": "studyId",
            "name": "检查号",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "deptStudyId",
            "name": "影像号",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientOutPatientId",
            "name": "门诊号",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientInPatientId",
            "name": "住院号",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientIdNumber",
            "name": "身份证号",
            "types": [
              "rad-input"
            ],
            "values": null
          }
        ]
      },
      {
        "category": "基础信息",
        "domains": [
          {
            "option": "patientName",
            "name": "患者姓名",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientEName",
            "name": "患者拼音姓名",
            "types": [
              "rad-nput"
            ],
            "values": null
          },
          {
            "option": "patientAge",
            "name": "年龄",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientAgeUnit",
            "name": "年龄单位",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientSex",
            "name": "性别",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientFolk",
            "name": "民族",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientPhoneNumber",
            "name": "联系电话",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientAddress",
            "name": "地址",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientSickRoom",
            "name": "患者病房",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "patientSickBed",
            "name": "患者病床",
            "types": [
              "rad-input"
            ],
            "values": null
          }
        ]
      },
      {
        "category": "检查信息",
        "domains": [
          {
            "option": "deviceTypeName",
            "name": "设备类型",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "deviceName",
            "name": "设备",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "studyDescribe",
            "name": "检查描述",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "applyDepartment",
            "name": "申请科室",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "clinicalInfo",
            "name": "临床诊断",
            "types": [
              "rad-input"
            ],
            "values": null
          },
          {
            "option": "reportDesc",
            "name": "检查所见",
            "types": [
              "rad-editor"
            ],
            "values": null
          },
          {
            "option": "reportDiagnose",
            "name": "报告诊断",
            "types": [
              "rad-editor"
            ],
            "values": null
          },
          {
            "option": "reportAdvice",
            "name": "报告建议",
            "types": [
              "rad-editor"
            ],
            "values": null
          }
        ]
      },
      {
        "category": "操作人",
        "domains": [
          {
            "option": "applyDoctor",
            "name": "申请医生",
            "types": [
              "rad-input",
              "rad-image"
            ],
            "values": null
          },
          {
            "option": "doctorId1",
            "name": "诊断医生",
            "types": [
              "rad-input",
              "rad-image"
            ],
            "values": null
          },
          {
            "option": "doctorId2",
            "name": "审核医生",
            "types": [
              "rad-input",
              "rad-image"
            ],
            "values": null
          },
          {
            "option": "performingPhysicianName",
            "name": "技师",
            "types": [
              "rad-input",
              "rad-image"
            ],
            "values": null
          }
        ]
      },
      {
        "category": "日期时间",
        "domains": [
          {
            "option": "studyTime",
            "name": "检查时间",
            "types": [
              "rad-datetime"
            ],
            "values": null
          },
          {
            "option": "reportTime",
            "name": "报告时间",
            "types": [
              "rad-datetime"
            ],
            "values": null
          }
        ]
      }
    ];
    this.tpls = localStorage.getItem('tableTemplate')
      ? JSON.parse(localStorage.getItem('tableTemplate'))
      : []
    if (localStorage.getItem('editedPageData')) {
      let pageData = JSON.parse(localStorage.getItem('editedPageData'))
      this.pageTpl = pageData.header + pageData.bodyTpl + pageData.footer
    }
  },
  mounted () {
    // 通过全局bus更新常用组件列表，模拟接口
    bus.$on('updateComps', (comps) => {
      this.customComp = JSON.parse(JSON.stringify(comps))
      localStorage.setItem('customComp', JSON.stringify(this.customComp))
    })
  },
  methods: {
    /** 表格操作 start */
    /**
     * @description: 删除表格模版
     * @param {*} e
     * @return {*}
     */
    deleteTableTpl (e) {
      this.tpls.splice(e, 1)
      localStorage.setItem('tableTemplate', JSON.stringify(this.tpls))
    },
    /**
     * @description:  调用接口保存表格编辑器内容
     * @param {*} e
     * @return {*}
     */
    saveTable (e) {
      let templist = this.tpls || []

      if (!e) {
        return
      }

      const { index, tpl, name, id, rels } = e
      const obj = {
        tpl,
        name,
        id,
        rels
      }
      if (index === -1) {
        templist.push(obj)
      } else {
        templist.splice(index, 1, obj)
      }

      localStorage.setItem('tableTemplate', JSON.stringify(templist))
      this.tpls = templist
    },
    /**
     * @description: 保存表格模版编辑器中的内容
     * @param {*}
     * @return {*}
     */
    saveTableTpl () {
      this.$refs.tableDesigner.getContent()
    },
    /*** 表格操作 end */

    /*** 编辑器操作 start */
    /**
     * @description: 保存编辑器编辑的内容
     * @param {*}
     * @return {*}
     */
    saveEditor () {
      // 编辑态保存数据
      this.$refs.editor.save()
    },
    /**
     * @description: 调用接口保存编辑状态的内容
     * @param {*} e
     * @return {*}
     */
    saveEditedPage (e) {
      localStorage.setItem('editedPageData', JSON.stringify(e))
    },
    /**
     * @description: 调用接口更新特殊字符集
     * @param {*} e
     * @return {*}
     */
    updateSpChars (e) {
      // 当特殊字符发生变更
      localStorage.setItem('chars', JSON.stringify(e))
    },
    /**
     * @description: 编辑一半的报告导入继续编辑
     * @param {*}
     * @return {*}
     */
    reeditTpl () {
      this.pageDataHis = JSON.parse(
        localStorage.getItem('editedPageData')
      ).editedData
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageDataHis, chars)
    },
    /**
     * @description: 导入设计完成的模版
     * @param {*}
     * @return {*}
     */
    importEditorTpl () {
      this.pageDataHis = JSON.parse(localStorage.getItem('pageData'))
      // 初始化字符集
      let chars = JSON.parse(localStorage.getItem('chars'))

      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.editor.resetPage(this.pageDataHis, chars)
    },
    /*** 编辑器操作 end */

    /*** 设计器操作 start */
    /**
     * @description: 调用内部暴露的saveDesignerData方法将设计器的数据发送到父组件
     * @param {*}
     * @return {*}
     */
    saveDesigner () {
      this.$refs.designer.saveDesignerData()
    },
    /**
     * @description: 保存设计器的数据
     * @param {*} e
     * @return {*}
     */
    saveDesignerData (e) {
      localStorage.setItem('pageData', JSON.stringify(e))
    },
    /**
     * @description: 导入设计模版，继续设计
     * @param {*}
     * @return {*}
     */
    importDesigner () {
      this.pageDataHis = JSON.parse(localStorage.getItem('pageData'))
      // 使用方式，通过refs将匹配结构的数据传给页面
      this.$refs.designer.conform(this.pageDataHis)
    }
    /*** 设计器操作 end */
  },
  watch: {
    activeName (val) {
      if (val === 'preview') {
        if (localStorage.getItem('editedPageData')) {
          let pageData = JSON.parse(localStorage.getItem('editedPageData'))
          this.pageTpl = {
            PROP_HEADER_HTML: pageData.header,
            PROP_PAGE_HTML: pageData.bodyTpl,
            PROP_FOOTER_HTML: pageData.footer
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.page-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .page-layout-ops {
    position: absolute;
    height: 50px;
    line-height: 50px;
    z-index: 1000;
    right: 50px;
  }
  .page-layout-header {
    height: 50px;
    background: #a5afc7;
    display: flex;
    width: 100%;
    z-index: 999;
    justify-content: center;
  }
  .designer-wrapper,
  .editor-preview {
    flex: 1;
    overflow: auto !important;
  }
  .iframe-wrapper {
    margin-top: 60px !important;
  }
  .cloase-btn {
    top: 68px !important;
  }
}
</style>
