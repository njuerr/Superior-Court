<template>
  <div class="absolute-center demo-login">
    <div class="q-ma-sm" style="margin-bottom: 30px">
      <h4>浙江省法院音频管理系统</h4>
    </div>
    <Login @on-submit="handleSubmit">
      <UserName name="username"/>
      <Password name="password" @keyup.enter="handleSubmit"/>
      <Submit/>
    </Login>
    <h6 class="text-red">{{ errmsg.msg }}</h6>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'login',
  setup () {
    const errmsg = reactive({ msg: '' })
    return {
      errmsg
    }
  },
  methods: {
    handleSubmit (valid, {
      username,
      password
    }) {
      if (username && password) {
        this.$socket.emit('userAuth', {
          user: username,
          passwd: password
        })
      }
    }
  },
  sockets: {
    recvError (data) {
      if (data === 1) {
        this.errmsg.msg = '用户名错误！'
      } else if (data === 0) {
        this.errmsg.msg = '密码错误！'
      }
    },
    recvToken (data) {
      if (data) {
        this.$socket.emit('systemLogs', {
          UserName: data,
          content: '用户登录成功！'
        })
        window.sessionStorage.setItem('token', data)
        this.$router.push('/')
      }
    }
  }
})
</script>
<style>
.demo-login {
  width: 400px;
  margin: 0 auto !important;
}

.demo-auto-login {
  margin-bottom: 24px;
  text-align: left;
}

.demo-auto-login a {
  float: right;
}
</style>
