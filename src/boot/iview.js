import { boot } from 'quasar/wrappers'
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

export default boot(({ app }) => {
  app.use(ViewUIPlus)
})
