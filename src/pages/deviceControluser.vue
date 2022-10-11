<template>
  <q-page style="background-color: #FFFFFF">
    <div>

      <div class="row" style="padding: 15px">
        <div><h6>受控设备：</h6></div>
        <div>
          <Select v-model="selectmenu.model" style="width:200px" @on-change="changeurl(selectmenu.model)"
                  @model-value="0">
            <Option v-for="item in selectmenu.devicelist" :value="item.value" :key="item.value">{{
                item.label
              }}
            </Option>
          </Select>
        </div>
        <div>
          <Input v-model="errInfor.errinput" placeholder="故障内容输入" clearable
                 style="margin-left: 20px;width: 300px"/>
        </div>
        <div>
          <q-btn flat color="blue" @click="errreturn" style="margin-left: 20px" ><h6>故障上报</h6></q-btn>
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
    const tempinfor = reactive({
      deviceid: '',
      courtid: ''
    })
    const errInfor = reactive({ errinput: '' })
    const openDialog = reactive({
      state: false,
      content: ''
    })
    const deviceurl = reactive({
      url: ''
    })
    const selectmenu = reactive({
      devicelist: [],
      model: ''
    })
    return {
      deviceurl,
      selectmenu,
      openDialog,
      errInfor,
      tempinfor
    }
  },
  created () {
    const id = this.$route.params.id
    this.$socket.emit('deviceManagementUrl', token, id)
    this.$socket.emit('Operatelogs', {
      UserName: token,
      content: '用户访问设备管理页面！'
    })
  },
  sockets: {
    recvdeviceadd (data) {
      console.log('sdafasdf', data)
      // this.deviceadd.url = data.ControlUrl
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          console.log('111111', data[i].DeviceName)
          this.selectmenu.devicelist.push({
            courtid: data[i].CourtID,
            label: data[i].DeviceName,
            value: data[i].ID,
            url: data[i].ControlUrl,
            deviceid: data[i].Deviceid
          })
        }
      } else {
        this.openDialog.content = '未找到设备,请联系管理员！'
        this.openDialog.state = true
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.selectmenu.model = this.selectmenu.devicelist[0].value
      this.deviceurl.url = this.selectmenu.devicelist[0].url
    }, 200)
  },
  methods: {
    changeurl (data) {
      for (let i = 0; i < this.selectmenu.devicelist.length; i++) {
        if (data === this.selectmenu.devicelist[i].value) {
          this.deviceurl.url = this.selectmenu.devicelist[i].url
          this.tempinfor.deviceid = this.selectmenu.devicelist[i].deviceid
        }
      }
    },
    errreturn () {
      if (this.tempinfor.deviceid === '') {
        this.tempinfor.deviceid = this.selectmenu.devicelist[0].deviceid
        this.tempinfor.courtid = this.selectmenu.devicelist[0].courtid
      } else {
        for (let i = 0; i < this.selectmenu.devicelist.length; i++) {
          if (this.selectmenu.devicelist[i].deviceid === this.tempinfor.deviceid) {
            this.tempinfor.courtid = this.selectmenu.devicelist[i].courtid
          }
        }
      }
      if (this.tempinfor.deviceid !== '' && this.errInfor.errinput !== '' && this.tempinfor.courtid !== '') {
        this.$socket.emit('monitorerrinput', this.tempinfor.courtid, this.errInfor.errinput, token, this.tempinfor.deviceid)
      }
      this.errInfor.errinput = ''
    }
  }
})
</script>
