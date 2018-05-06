import { version } from '../package.json'
import { OPTIONS } from './constants'
import mixin from './mixin'

export default function VueHead (Vue, options) {
  Vue.mixin(mixin(Vue))

  Object.defineProperty(Vue.prototype, '$head', {
    options: { ...OPTIONS, ...options }
  })
}

VueHead.version = version

// auto install
if (typeof window !== 'undefined' && typeof window.Vue !== 'undefined') {
  window.Vue.use(VueHead)
}
