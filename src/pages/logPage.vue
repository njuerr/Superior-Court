<template>
  <div class="q-pa-md">
    <div class="row flex flex-center">
      <div class="col-11 q-ma-sm">
        <q-table
          title="故障处理日志"
          :rows="failtables.rows"
          :columns="failtables.columns"
          row-key="name"
          :filter="tableFilter.process"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="tableFilter.process" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </div>
    <div class="row flex flex-center">
      <div class="col-11 q-ma-sm">
        <q-table
          title="系统日志"
          :rows="operatetables.rows"
          :columns="operatetables.columns"
          row-key="name"
          :filter="tableFilter.system">
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="tableFilter.system" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script>

import { reactive } from 'vue'

const token = window.sessionStorage.getItem('token')
export default {
  name: 'logPage',
  setup () {
    const tableFilter = reactive({
      report: '',
      process: '',
      system: ''
    })
    const operatetables = reactive({
      columns: [
        {
          name: 'datetime',
          required: true,
          label: '时间',
          align: 'left',
          field: row => row.datetime,
          format: val => `${val}`,
          style: 'width: 50px',
          sortOrder: 'ad',
          sortable: true
        },
        {
          name: 'address',
          align: 'center',
          label: 'IP地址',
          style: 'width: 200px',
          field: 'address'
        },
        {
          name: 'userName',
          align: 'center',
          label: '操作帐号',
          style: 'width: 100px',
          field: 'userName'
        },
        {
          name: 'content',
          align: 'center',
          label: '日志内容',
          field: 'content'
        }
      ],
      rows: []
    })
    const failtables = reactive({
      columns: [
        {
          name: 'Failid',
          required: true,
          label: '故障ID',
          align: 'left',
          field: row => row.failId,
          format: val => `${val}`,
          style: 'width: 30px',
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: 'Reporttime',
          align: 'center',
          label: '上报时间',
          style: 'width: 20px',
          field: 'reportTime'
        },
        {
          name: 'Processtime',
          align: 'center',
          label: '处理时间',
          style: 'width: 20px',
          field: 'processTime'
        },
        {
          name: 'courtName',
          align: 'center',
          label: '故障节点',
          field: 'courtName'
        },
        {
          name: 'deviceName',
          align: 'center',
          label: '故障设备',
          field: 'deviceName'
        },
        {
          name: 'Reportuser',
          align: 'center',
          label: '上报帐号',
          field: 'reportUser'
        },
        {
          name: 'Processuser',
          align: 'center',
          label: '处理帐户',
          field: 'processUser'
        },
        {
          name: 'Failcontent',
          align: 'left',
          label: '上报内容',
          field: 'failContent'
        },
        {
          name: 'Processcontent',
          align: 'left',
          label: '处理方案',
          field: 'processContent'
        }
      ],
      rows: []
    })
    return {
      operatetables,
      failtables,
      tableFilter
    }
  },
  beforeCreate () {
    this.$socket.emit('failureLogs')
    this.$socket.emit('operateLogs', token)
    this.$socket.emit('systemLogs', {
      token,
      content: '用户访问日志页面！'
    })
  },
  sockets: {
    recvSystemLogs (data) {
      console.log('日志', data)
      for (let i = 0; i < data.length; i++) {
        this.operatetables.rows.push({
          address: data[i].address,
          datetime: data[i].time,
          userName: data[i].userName,
          content: data[i].content
        })
      }
    },
    recvFailureLogs (data) {
      console.log('fail', data)
      this.failtables.rows = data
    }
  }
}

</script>

<style scoped>

</style>
