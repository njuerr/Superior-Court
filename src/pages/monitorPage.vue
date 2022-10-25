<!--suppress ALL -->
<template>
  <q-page>
    <!-- 用于表头状态色标及上报日志下拉框 -->
    <div class="q-pa-md">
      <div class="row">
        <div class="col-4">
        </div>
        <div class="col-3"/>
        <div class="col-5">
          <div class="q-pa-md">
            <q-btn-group spread>
              <q-btn flat label="远程管理" icon="visibility" :color="controlButtons.remoteManagement.color"
                     @click="Remotemanage"/>
              <q-btn flat label="设备定位" icon="timeline" :color="controlButtons.deviceLocation.color"
                     @click="Devicetarget"/>
              <q-btn flat label="故障录入" icon="bookmark" :color="controlButtons.deviceInformation.color"
                     @click="Deviceinfo"/>
              <q-btn flat label="故障处理" icon="share" :color="controlButtons.faultHandling.color"
                     @click="Failprocess"/>
            </q-btn-group>
          </div>
        </div>
      </div>
    </div>
    <!-- 用于列表显示各法院 -->
    <div class="flex ivu-row-center" v-if="courtif.state">
      <q-card class="my-card" style="margin:5px" v-for="(item, id) in courtData" :key='id'>
        <q-card-section>
          <q-btn flat disable style="font-size: 20px;margin-top: -30px;margin-bottom: -30px;">{{ id }}</q-btn>
        </q-card-section>
        <q-separator/>
        <q-card-actions vertical>
          <q-btn v-for="(item1, id) in item" :key='id' :disable="btnDisable.dis"
                 :color="courtState[item1.id]" @click="courtBtn(item1,courtState[item1.id],item1.id)">{{ item1.name }}
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <!-- 用于下方色标 -->
    <div class="q-pa-md">
      <div class="row">
        <div class="col-1">
        </div>
        <div class="col">
          <span class="text-h5">系统时钟:  {{ serverdata.serverTime }}</span>
        </div>
        <div class="col-4">
          <span class="text-h5">运行状态色标:</span>
          <q-badge color="green" class="text-h6" label="运行正常" style="margin: 10px"/>
          <q-badge color="blue" class="text-h6" label="设备故障" style="margin: 10px"/>
          <q-badge color="red" class="text-h6" label="设备离线" style="margin: 10px"/>
        </div>
      </div>
    </div>
    <!-- 用于故障信息弹出式窗口 -->
    <div>
      <q-dialog v-model="openDialog.errinputDialog">
        <q-card style="min-width: 500px;height: 200px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">故障录入</div>
            <q-space/>
            <q-btn icon="close" flat round dense v-close-popup/>
          </q-card-section>
          <q-card-section>
            <q-card-section>
              <Select v-model="devicelist.model" style="width:100px;margin-right: 10px">
                <Option v-for="item in devicelist.data" :value="item.deviceId" :key="item.deviceId">
                  {{ item.deviceName }}
                </Option>
              </Select>
              <Input v-model="errInfo.errinput" placeholder="故障内容输入" clearable
                     style="margin-right: 20px;width: 300px"/>
              <q-btn flat @click="errreturn">提交</q-btn>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!-- 用于设备定位弹出式窗口 -->
    <div>
      <q-dialog v-model="openDialog.deviceLocation">
        <q-card class="my-card">
          <q-card-section>
            <q-card-actions class="justify-around">
              <Select v-model="devicelist.model" style="width:100px;margin-right: 10px">
                <Option v-for="item in devicelist.data" :value="item.deviceId" :key="item.deviceId">{{
                    item.deviceName
                  }}
                </Option>
              </Select>
              <q-btn flat :color="controlButtons.turnOnDeviceTarget.color" icon="adjust" label="开启定位"
                     @click="deviceLocation"/>
            </q-card-actions>
            <img src="http://127.0.0.1/机柜图.jpg" width="300">
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!-- 用于故障处理弹出式窗口 -->
    <div class="q-pa-md">
      <q-dialog v-model="openDialog.errprocess">
        <div style="min-width: 800px; max-width: 140vw;">
          <q-table
            :rows="failtables.rows"
            :columns="failtables.columns"
            title="故障处理"
            :rows-per-page-options="[]"
            row-key="Failid"
          >
            <template v-slot:top-right>
              <q-btn label="资料下载" flat color="red" size="lg" @click="downfilepage"></q-btn>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="failId" :props="props">
                  {{ props.row.failId }}
                </q-td>
                <q-td key="reportTime" :props="props">
                  {{ props.row.reportTime }}
                </q-td>
                <q-td key="reportUser" :props="props">
                  {{ props.row.reportUser }}
                </q-td>
                <q-td key="failContent" :props="props">
                  {{ props.row.failContent }}
                </q-td>
                <q-td key="processContent" :props="props">
                  {{ props.row.processContent }}
                  <q-popup-edit v-model="props.row.Processcontent" buttons label-set="保存" label-cancel="关闭"
                                v-slot="scope" @save="failfunc" @show="getfailid(props.row.failId)">
                    <q-input v-model.number="scope.value" dense autofocus @keyup.enter="scope.set"/>
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-dialog>
    </div>
    <!-- 用于用于资料下载窗口 -->
    <div class="q-pa-md">
      <q-dialog v-model="openDialog.downfileDialog">
        <q-card class="my-card" style="min-width: 800px; max-width: 140vw;">
          <q-list bordered class="rounded-borders">
            <q-item-label header><h4>资料下载</h4></q-item-label>
            <q-separator spaced/>
            <q-item clickable v-ripple v-for="(item,index) in filedownconn.filelist" :key="index"
                    @click="downfile(item.Filename,item.Filesavename)">
              <q-item-section top class="col-2 gt-sm">
                <q-item-label class="q-mt-sm"><h5>{{ item.Filetype }}</h5></q-item-label>
              </q-item-section>

              <q-item-section top>
                <q-item-label lines="1">
                  <span class="text-weight-medium"><h5>{{ item.Filename }}</h5></span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <h6>{{ item.Filetext }}</h6>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-dialog>
    </div>
    <div>
      <!-- 用于错误弹出窗口 -->
      <q-dialog v-model="openDialog.errorDialog">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">{{ this.errDialoginfo.head }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ this.errDialoginfo.content }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from 'vue'

const token = window.sessionStorage.getItem('token')
export default defineComponent({
  name: 'monitorPage',
  // 挂载前接收后端法院列表
  beforeCreate () {
    this.$socket.emit('getCourtState')
    // this.$socket.emit('tcpconn')
    this.$socket.emit('systemLogs', {
      token,
      content: '用户访问监测管理页面！'
    })
    this.$socket.emit('monitoringManagementInit', token)
  },
  unmounted () {
    console.log(1111)
    // this.$socket.emit('closeconn')
  },
  setup () {
    // 用于文件下载
    const filedownconn = reactive({
      courtId: '',
      filelist: []
    })
    // 用于服务器时间
    const serverdata = reactive({ serverTime: '' })
    // 设备列表用于故障录入页面
    const devicelist = reactive({
      data: [],
      model: ''
    })
    // 用于故障录入页的数据绑定
    const errInfo = reactive({
      errinput: '',
      courtId: ''
    })
    // 用于故障处理
    const failtables = reactive({
      columns: [
        {
          name: 'failId',
          align: 'center',
          label: '故障ID',
          field: 'failId'
        },
        {
          name: 'reportTime',
          align: 'center',
          label: '上报时间',
          field: 'reportTime'
        },
        {
          name: 'reportUser',
          align: 'left',
          label: '上报帐号',
          field: 'reportUser'
        },
        {
          name: 'failContent',
          align: 'left',
          label: '故障内容',
          field: 'failContent'
        },
        {
          name: 'processContent',
          align: 'center',
          label: '处理方案',
          field: 'processContent'
        }
      ],
      rows: []
    })
    // 用于法院列表的数据加载开关
    const courtif = reactive({ state: false })
    // 用于系统时间的更新
    const systemTime = reactive({ time: '' })
    // 用于弹出窗口控制
    const openDialog = reactive({
      errinputDialog: false,
      jtDialog: false,
      deviceLocation: false,
      errprocess: false,
      errorDialog: false,
      downfileDialog: false
    })
    // 用于错误弹出窗口信息
    const errDialoginfo = reactive(
      {
        head: '',
        content: ''
      }
    )
    // 用于存放临时打开内容的数据
    const tempdata = reactive({ failid: '' })
    // 用于故障上报框
    const model = reactive(null)
    // 用于右上控制按钮
    const controlButtons = reactive({
      // 用于远程管理的状态
      remoteManagement: { color: '' },
      // 用于设备定位的状态
      deviceLocation: { color: '' },
      // 用于设备定位的开启定位按钮
      turnOnDeviceTarget: { color: 'red' },
      // 用于故障处理的状态
      faultHandling: { color: '' },
      // 用于设备信息的状态
      deviceInformation: { color: '' }
    })
    // 用于法院按钮状态，开启与关闭
    const btnDisable = reactive({ dis: true })
    // 法院状态
    const courtState = reactive({})
    // 法院信息表
    const courtData = reactive({})
    return {
      model,
      btnDisable,
      courtState,
      controlButtons,
      openDialog,
      errDialoginfo,
      systemTime,
      courtif,
      failtables,
      errInfo,
      courtData,
      devicelist,
      tempdata,
      serverdata,
      filedownconn
    }
  },
  methods: {
    // 用于故障处理页的下载功能
    downfile (name, url) {
      const a = document.createElement('a')
      a.href = url
      a.target = '_new'
      a.click()
    },
    // 用于故障处理页的资料下载页面打开
    downfilepage () {
      this.$socket.emit('fileDownload', this.filedownconn.courtId)
      this.openDialog.errprocess = false
      setTimeout(() => {
        this.openDialog.downfileDialog = true
      }, 200)
    },
    // 用于远程管理按扭
    Remotemanage () {
      if (this.controlButtons.remoteManagement.color === '' && this.controlButtons.deviceLocation.color !== 'red' && this.controlButtons.faultHandling.color !== 'red' && this.controlButtons.deviceInformation.color !== 'red') {
        this.controlButtons.remoteManagement.color = 'red'
        this.btnDisable.dis = false
      } else if (this.controlButtons.remoteManagement.color === 'red' && this.controlButtons.deviceLocation.color === '' && this.controlButtons.faultHandling.color === '' && this.controlButtons.deviceInformation.color === '') {
        this.controlButtons.remoteManagement.color = ''
        this.btnDisable.dis = true
      }
    },
    // 用于设备定位的按钮实现
    Devicetarget () {
      if (this.controlButtons.deviceLocation.color === '' && this.controlButtons.remoteManagement.color !== 'red' && this.controlButtons.faultHandling.color !== 'red' && this.controlButtons.deviceInformation.color !== 'red') {
        this.controlButtons.deviceLocation.color = 'red'
        this.btnDisable.dis = false
      } else if (this.controlButtons.deviceLocation.color === 'red' && this.controlButtons.remoteManagement.color === '' && this.controlButtons.faultHandling.color === '' && this.controlButtons.deviceInformation.color === '') {
        this.controlButtons.deviceLocation.color = ''
        this.btnDisable.dis = true
      }
    },
    // 用于错误信息处理功能
    Failprocess () {
      if (this.controlButtons.faultHandling.color === '' && this.controlButtons.deviceLocation.color !== 'red' && this.controlButtons.remoteManagement.color !== 'red' && this.controlButtons.deviceInformation.color !== 'red') {
        this.controlButtons.faultHandling.color = 'red'
        this.btnDisable.dis = false
      } else if (this.controlButtons.faultHandling.color === 'red' && this.controlButtons.deviceLocation.color === '' && this.controlButtons.remoteManagement.color === '' && this.controlButtons.deviceInformation.color === '') {
        this.controlButtons.faultHandling.color = ''
        this.btnDisable.dis = true
      }
    },
    // 用于设备信息页的按据
    Deviceinfo () {
      if (this.controlButtons.deviceInformation.color === '' && this.controlButtons.deviceLocation.color !== 'red' && this.controlButtons.remoteManagement.color !== 'red' && this.controlButtons.faultHandling.color !== 'red') {
        this.controlButtons.deviceInformation.color = 'red'
        this.btnDisable.dis = false
      } else if (this.controlButtons.deviceInformation.color === 'red' && this.controlButtons.deviceLocation.color === '' && this.controlButtons.remoteManagement.color === '' && this.controlButtons.faultHandling.color === '') {
        this.controlButtons.deviceInformation.color = ''
        this.btnDisable.dis = true
      }
    },
    // 用于页面法院表中的按扭方法
    courtBtn (data, color, id) {
      console.log(99999, data, color, id)
      if (color === 'red' && this.controlButtons.deviceLocation.color !== 'red' && this.controlButtons.faultHandling.color !== 'red' && this.controlButtons.deviceInformation.color !== 'red') {
        this.errDialoginfo.head = '错误'
        this.errDialoginfo.content = '设备未在线'
        this.openDialog.errorDialog = true
      } else {
        // 获取设备按制URL路径，主要加了法院名称
        const courturl = '/devicecontrol/' + data.id
        if (this.controlButtons.remoteManagement.color === 'red') {
          this.$socket.emit('systemLogs', {
            token,
            content: '打开' + data.name + '的远程管理页面！'
          })
          this.$router.push({
            path: courturl
          })
        }
        if (this.controlButtons.deviceInformation.color === 'red') {
          this.$socket.emit('systemLogs', {
            token,
            content: '打开' + data.name + '的故障信息录入页面！'
          })
          this.errInfo.courtId = data.id
          // 获取故障设备信息
          this.$socket.emit('getFailureDevice', data.id)
          setTimeout(() => {
            if (this.devicelist.data.length !== 0) {
              this.openDialog.errinputDialog = true
            }
          }, 200)
        }
        if (this.controlButtons.deviceLocation.color === 'red') {
          this.$socket.emit('systemLogs', {
            token,
            content: '打开' + data.name + '的设备定位页面！'
          })
          // 获取故障设备信息
          this.$socket.emit('getFailureDevice', data.id)
          this.openDialog.deviceLocation = true
        }
        if (this.controlButtons.faultHandling.color === 'blue' || this.controlButtons.faultHandling.color === 'red') {
          this.$socket.emit('faultHandling', id)
          this.filedownconn.courtId = id
          this.$socket.emit('systemLogs', {
            token,
            content: '打开' + data.name + '的故障处理页面！'
          })
          this.openDialog.errprocess = true
        }
      }
    },
    // 用于故障信息上报
    errreturn () {
      if (this.errInfo.courtId !== '' && this.errInfo.errinput !== '' && this.devicelist.model !== '') {
        this.$socket.emit('monitorFailureInputLogs', this.errInfo.courtId, this.errInfo.errinput, token, this.devicelist.model)
      }
      this.errInfo.errinput = ''
      this.openDialog.errinputDialog = false
    },
    // 用于故障处理页面的处理方法提交
    failfunc (value, initialValue) {
      const v = value.toString()
      this.$socket.emit('failureHandleSubmit', this.tempdata.failid, v, token)
      // 用于删除页面的故障条目
      for (let i = 0; i < this.failtables.rows.length; i++) {
        if (this.failtables.rows[i].failId === this.tempdata.failid) {
          this.failtables.rows.splice(i, 1)
        }
      }
      // this.openDialog.errprocess = false
    },
    // 用于故障处理页面的接收故障ID
    getfailid (failid) {
      this.tempdata.failid = failid
    },
    // 用于设备定位turnOnDeviceTarget
    deviceLocation () {
      if (this.controlButtons.turnOnDeviceTarget.color === 'red') {
        this.controlButtons.turnOnDeviceTarget.color = 'green'
      } else {
        this.controlButtons.turnOnDeviceTarget.color = 'red'
      }
      this.$socket.emit('deviceLocation', this.devicelist.model)
    }
  },
  sockets: {
    // 得到文件下载初始化列表
    fileDownload (data) {
      this.filedownconn.filelist = data
    },
    // 用于页面初使数据
    recvRemoteMonitorInit (data) {
      console.log(22222, data)
      this.courtData = data
      if (this.courtData) {
        this.courtif.state = true
      }
      // const xjg = { 杭州地区: [{}] }
    },
    // 用于接收法院状态
    recvCourtState (data) {
      for (let i = 0; i < data.length; i++) {
        console.log('data[30]', data[i])
        if (data[i].courtState === '0') {
          this.courtState[data[i].courtId] = 'red'
        } else if (data[i].courtState === '1') {
          this.courtState[data[i].courtId] = 'blue'
        } else if (data[i].courtState === '2') {
          this.courtState[data[i].courtId] = 'green'
        } else if (data[i].courtId === 'serverTime') {
          const datetime = data[i].courtState.split(' ')
          const time = datetime[1].split('-')
          this.serverdata.serverTime = datetime[0] + ' ' + time[0] + ':' + time[1] + ':' + time[2]
        }
      }
      console.log('r1r1111111', this.courtState[31])
    },
    // 用于接收故障录入页面的设备列表
    recvdevicelist (data) {
      console.log('data', data)
      this.devicelist.data = data
    },
    // 用于接收故障处理页面的故障情况
    recvFailureInfo (data) {
      this.failtables.rows = data
    }
  }
})
</script>

<style>
.ivu-progress-inner {
  border-radius: 6px
}

.ivu-progress-bg {
  border-radius: 6px
}
</style>
