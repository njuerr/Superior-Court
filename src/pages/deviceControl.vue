<template>
  <q-page style="background-color: #FFFFFF;">
    <div>

      <div class="row" style="padding: 15px">
        <div><h6>受控设备：</h6></div>
        <div>
          <Select v-model="selectMenu.model" style="width:200px" @on-change="changeurl(selectMenu.model)"
                  @model-value="0">
            <Option v-for="item in selectMenu.devicelist" :value="item.value" :key="item.value">{{
                item.label
              }}
            </Option>
          </Select>
        </div>
        <div>
          <Input v-model="errInfo.errinput" placeholder="故障内容输入" clearable
                 style="margin-left: 20px;width: 300px"/>
        </div>
        <div>
          <q-btn flat color="blue" @click="errreturn" style="margin-left: 20px"><h6>故障上报</h6></q-btn>
        </div>
        <div style="margin-left: 350px;margin-top: 4px">
          <h6>{{ remotestate.name }}</h6>
        </div>
        <div style="margin-left: 50px;margin-top: 4px">
          <Select v-model="remoteListenDropDownList.model" style="width:200px"
                  @model-value="0">
            <Option v-for="item in remoteProgress" :value="item.ChannelCode" :key="item.ID">{{
                item.ChannelName
              }}
            </Option>
          </Select>
        </div>
        <div>
          <q-btn flat :color="remoteListenDropDownList.color" @click="openRemoteListening" style="margin-left: 20px"><h6>开启监听</h6></q-btn>
        </div>
      </div>
      <div class="flex flex-center">
        <iframe
          :src="deviceurl.url"
          id="mobsf" scrolling="no" frameborder="0"
          style="width: 1328px; height: 830px;transform-origin:top"></iframe>
      </div>
      <!-- 用于显示嵌入式界面
      <img src="http://m.kxmaudio.com/uploads/xjg.png" width="1400" height="900"> -->
    </div>
    <div>
      <!-- 用于错误弹出窗口 -->
      <q-dialog v-model="openDialog.state">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">错误</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ this.openDialog.content }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" to="/"/>
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
  name: 'deviceControl',
  setup () {
    // 用于远程监听下拉列表
    const remoteListenDropDownList = reactive({
      model: '',
      color: 'red'
    })
    // 用于记录监听状态
    const remotestate = reactive({
      state: '',
      name: ''
    })
    // 用于远程监听按钮
    const remoteProgress = reactive([])
    const tempInfo = reactive({
      deviceId: '',
      courtId: ''
    })
    const errInfo = reactive({ errinput: '' })
    const openDialog = reactive({
      state: false,
      content: ''
    })
    const deviceurl = reactive({
      url: ''
    })
    const selectMenu = reactive({
      devicelist: [],
      model: ''
    })
    return {
      deviceurl,
      selectMenu,
      openDialog,
      errInfo,
      tempInfo,
      remoteProgress,
      remotestate,
      remoteListenDropDownList
    }
  },
  created () {
    this.$socket.emit('openRemoteListening', 'meter 12', '1', 'open')
    console.log(window.screen.height)
    const id = this.$route.params.id
    this.remotestate.name = '远程监听：'
    this.$socket.emit('getRemoteListening', id)
    this.$socket.emit('deviceManagementUrl', token, id)
    this.$socket.emit('systemLogs', {
      token,
      content: '用户访问设备管理页面！'
    })
  },
  sockets: {
    // 用于接收远程监听
    recvYcjtinit (data) {
      console.log(32323, data)
      this.remoteProgress = data
      console.log(939, this.remoteProgress)
    },
    recvdeviceadd (data) {
      console.log(111111, data)
      // this.deviceadd.url = data.ControlUrl
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('111111', data[i].deviceName)
          this.selectMenu.devicelist.push({
            courtId: data[i].courtId,
            label: data[i].deviceName,
            value: data[i].Id,
            url: data[i].controlUrl,
            deviceId: data[i].deviceId
          })
        }
      } else {
        this.openDialog.content = '未找到设备,请联系管理员！'
        this.openDialog.state = true
      }
    },
    logOut () {
      this.$router.push('/login')
    }
  },
  mounted () {
    setTimeout(() => {
      this.selectMenu.model = this.selectMenu.devicelist[0].value
      this.deviceurl.url = this.selectMenu.devicelist[0].url
    }, 200)
  },
  methods: {
    // 用于远程监听页面下的监听按扭的功能实现
    openRemoteListening () {
      if (this.remoteListenDropDownList.color === 'red') {
        this.remoteListenDropDownList.color = 'green'
        for (let i = 0; i < this.remoteProgress.length; i++) {
          if (this.remoteListenDropDownList.model === this.remoteProgress[i].ChannelCode) {
            console.log(3232323, 2111, this.remoteListenDropDownList.model)
            this.$socket.emit('openRemoteListening', this.remoteProgress[i].ChannelCode, this.remoteProgress[i].deviceId, 'open')
          }
        }
      } else {
        this.$socket.emit('openRemoteListening', 'meter 3', '1', 'close')
        this.remoteListenDropDownList.color = 'red'
      }
    },
    changeurl (data) {
      console.log(222222222, data)
      this.remotestate.state = ''
      this.$socket.emit('openRemoteListening', 'meter 3', '1', 'close')
      for (let i = 0; i < this.selectMenu.devicelist.length; i++) {
        if (data === this.selectMenu.devicelist[i].value) {
          this.$socket.emit('getRemoteListening', this.selectMenu.devicelist[i].deviceId)
          this.deviceurl.url = this.selectMenu.devicelist[i].url
          this.tempInfo.deviceId = this.selectMenu.devicelist[i].deviceId
        }
      }
    },
    errreturn () {
      if (this.tempInfo.deviceId === '') {
        this.tempInfo.deviceId = this.selectMenu.devicelist[0].deviceId
        this.tempInfo.courtId = this.selectMenu.devicelist[0].courtId
      } else {
        for (let i = 0; i < this.selectMenu.devicelist.length; i++) {
          if (this.selectMenu.devicelist[i].deviceId === this.tempInfo.deviceId) {
            this.tempInfo.courtId = this.selectMenu.devicelist[i].courtId
          }
        }
      }
      if (this.tempInfo.deviceId !== '' && this.errInfo.errinput !== '' && this.tempInfo.courtId !== '') {
        this.$socket.emit('monitorFailureInputLogs', this.tempInfo.courtId, this.errInfo.errinput, token, this.tempInfo.deviceId)
      }
      this.errInfo.errinput = ''
    }
  }
})
</script>
