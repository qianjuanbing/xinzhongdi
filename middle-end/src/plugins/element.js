// 替换旧版 Element UI 的引入方式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default (app) => {
  app.use(ElementPlus)
}
