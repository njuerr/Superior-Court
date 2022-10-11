<template>
  <router-view/>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  sockets: {
    connect: function () {
      console.log('服务器已连接')
    },
    disconnect: function () {
      console.log('服务器离线')
    }
  }
})
</script>
