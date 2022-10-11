import { boot } from 'quasar/wrappers'
import VueSocketIO from 'vue-3-socket.io'

export default boot(({ app }) => {
  app.use(new VueSocketIO({
    debug: true,
    connection: 'ws://127.0.0.1:8000/'
  }))
})
