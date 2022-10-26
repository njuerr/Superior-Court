<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="margin: 30px;height: 800px"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
        >
          <q-tab name="user" icon="mail" label="用户管理"/>
          <q-tab name="zone" icon="alarm" label="区域管理"/>
          <q-tab name="court" icon="movie" label="法院管理"/>
          <q-tab name="device" icon="movie" label="设备管理"/>
          <q-tab name="menu" icon="movie" label="菜单管理"/>
          <q-tab name="files" icon="movie" label="文档管理"/>
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="user">
            <div class="text-h4 q-mb-md">Mails</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="zone">
            <div class="text-h4 q-mb-md">Alarms</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="court">
            <div class="text-h4 q-mb-md">Movies</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>
          <q-tab-panel name="device">
            <div class="text-h4 q-mb-md">Mails</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="menu">
            <div class="text-h4 q-mb-md">Alarms</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>

          <q-tab-panel name="files">
            <div class="text-h4 q-mb-md">Movies</div>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure
              quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam.
              In, libero.</p>
          </q-tab-panel>
        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'userPages',
  setup () {
    return {
      tab: ref('mails'),
      splitterModel: ref(10)
    }
  },
  methods: {
    handleSubmit (valid, {
      username,
      password
    }) {
      if (username && password) {
        this.$socket.emit('userauth', {
          user: username,
          passwd: password
        })
      }
    }
  },
  sockets: {
    recvToken (data) {
      if (data) {
        this.$socket.emit('systemLogs', {
          UserName: data,
          content: '用户登录成功！'
        })
        window.sessionStorage.setItem('token', data)
        this.$router.push('/')
      }
    },
    logOut () {
      this.$router.push('/login')
    }
  }
})
</script>
