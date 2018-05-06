import { init, destroy } from './methods'

export default function mixin (Vue) {
  if (Vue.version.match(/[1].(.)+/g)) {
    return {
      ready () {
        init.call(this)
      },
      destroyed () {
        destroy.call(this)
      }
    }
  }
  // For >=2 Vue version
  return {
    mounted () {
      init.call(this)
    },
    beforeDestroy () {
      destroy.call(this)
    }
  }
}
