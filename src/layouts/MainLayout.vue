<template>
  <div>
    <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-toolbar-title>远程音频管理平台</q-toolbar-title>
          <q-btn stretch flat v-for="(item, id) in menuList.menudata" :key='id' @click="navClick(item)"
                 style="color: white">
            {{ item.MenuName }}
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  beforeCreate () {
    const token = window.sessionStorage.getItem('token')
    this.$socket.emit('menuList', token)
  },
  setup () {
    const menuList = reactive({
      menudata: {}
    })
    return {
      menuList
    }
  },
  methods: {
    navClick (nav) {
      this.$router.push(nav.MenuLink)
    }
  },
  sockets: {
    revMenuList (data) {
      this.menuList.menudata = data
      console.log(this.menuList.menudata)
    }
  }
})
</script>
