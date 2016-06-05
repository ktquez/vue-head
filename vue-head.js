;(function () {

  'use strict'

  var opt = {
    compl: document.title,
    separator: '|'
  }

  var diff = []
  var diffTitle = {}
  var installed = false

  /**
   * This function return the element <head>
   * @return {Object}
   */
  function getHead () {
    return document.getElementsByTagName('head')[0]
  }

  /**
   * Undo the document title for previous state
   * @param  {Object} state 
   */
  function undoTitle (state) {
    if (!state.before) return
    document.title = state.before
  }

  /**
   * Undo elements to its previous state
   * @param  {Object} states
   */
  function undo (states) {
    if (!states.length) return
    states.map((state) => {
      (state.before) ? this.getHead().replaceChild(state.before, state.after) : this.getHead().removeChild(state.after)
    })
  }

  /**
   * Change document title
   * @param  {Object} val
   */
  function title (objTitle) {
    if (!objTitle) return
    diffTitle.before = opt.compl
    document.title = objTitle.inner + ' ' + (objTitle.separator || opt.separator) + ' ' + (objTitle.compl || opt.compl)
  }

  /**
   * Manages meta tags
   * @param  {Object} objMeta
   */
  function meta (objMeta) {
    if (!objMeta) return
    var state = {}

    Object.keys(objMeta).map((prop) => {
      var meta = objMeta[prop]

      Object.keys(meta).map((value) => {

        // set state of elements
        var el = this.getHead().querySelector('meta[' + prop + '="' + value + '"]') || document.createElement('meta')
        var clone = el.cloneNode(true)

        // Assign Content
        el.setAttribute('content', meta[value])

        // If exists element
        if (el.getAttribute(prop)) {
          state.before = clone
          state.after = el
          diff.push(state)
          return
        }

        // If not exists element
        el.setAttribute(prop, value)
        this.getHead().appendChild(el)
        state.after = el
        diff.push(state)
      })

    })
  }

  /**
   * Manages link tags
   * @param  {Object} objLink
   */
  function link (objLink) {
    if (!objLink) return
    var state = {}

    Object.keys(objLink).map((rel) => {
      var el = this.getHead().querySelector('link[rel="' + rel + '"]') || document.createElement('link')
      var props = objLink[rel]
      var clone = el.cloneNode(true)

      // Assign for each the props
      Object.keys(props).map((prop) => {
        el.setAttribute(prop, props[prop])
      })

      // If exists element
      if (el.getAttribute('rel')) {
        state.before = clone
        state.after = el
        diff.push(state)
        return
      }

      // If not exists element
      el.setAttribute('rel', rel)
      this.getHead().appendChild(el)
      state.after = el
      diff.push(state)
    })
  }

  /**
   * Plugin | vue-head
   * 
   * @param  {Function} Vue
   * @param  {Object} options
   */
  function vueHead (Vue, options){

    if (installed) return
    installed = true

    if (options) { 
      Vue.util.extend(opt, options) 
    }

    Vue.mixin({
      ready () {
        let self = this
        let head = this.$options.head
        if (!head) return
        Object.keys(head).map((key) => {
          if (head[key]) {
            let obj = (typeof head[key] === 'object') ? head[key] : head[key].bind(self)()
            util[key](obj)
          }
        })
      },
      destroyed () {
        let head = this.$options.head
        if (head.undo || typeof head.undo === 'undefined') {
          util.undoTitle(diffTitle)
          util.undo(diff)
        }
        diff = []
      }
    })
  }

  vueHead.version = '0.0.1'

  // auto install
  if (typeof Vue !== 'undefined') {
    Vue.use(vueHead)
  }

  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = vueHead
  } else if(typeof define === 'function' && define.amd) {
    define(function () { return vueHead })
  } else if (typeof window !== 'undefined') {
    window.vueHead = vueHead
  }

})()