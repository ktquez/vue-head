;(function () {

  'use strict'

  var opt = {
    complement: document.title,
    separator: '|'
  }

  var diff = []
  var diffTitle = {}
  var installed = false

  var util = {
    
    /**
     * This function return the element <head>
     * @return {Object}
     */
    getHead: function () {
      return document.getElementsByTagName('head')[0]
    },

    /**
     * Undo the document title for previous state
     * @param  {Object} state 
     */
    undoTitle: function (state) {
      if (!state.before) return
      document.title = state.before
    },

    /**
     * Undo elements to its previous state
     * @param  {Object} states
     */
    undo: function (states) {
      if (!states.length) return
      var headElement = this.getHead()
      states.map(function (state) {
        ;(state.before) ? headElement.replaceChild(state.before, state.after) : headElement.removeChild(state.after)
      })
    },

    /**
     * Change document title
     * @param  {Object} val
     */
    title: function (objTitle) {
      if (!objTitle) return
      diffTitle.before = opt.complement
      document.title = objTitle.inner + ' ' + (objTitle.separator || opt.separator) + ' ' + (objTitle.complement || opt.complement)
    },

    /**
     * Manages meta tags
     * @param  {Object} objMeta
     */
    meta: function (objMeta) {
      if (!objMeta) return
      var self = this

      Object.keys(objMeta).map(function (prop) {
        var meta = objMeta[prop]

        Object.keys(meta).map(function (value) {

          // set state of elements
          var el = self.getHead().querySelector('meta[' + prop + '="' + value + '"]') || document.createElement('meta')
          var clone = el.cloneNode(true)
          var state = {}

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
          self.getHead().appendChild(el)
          state.after = el
          diff.push(state)
        })

      })
    },

    /**
     * Manages link tags
     * @param  {Object} objLink
     */
    link: function (objLink) {
      if (!objLink) return
      var self = this

      Object.keys(objLink).map(function (rel) {
        var el = self.getHead().querySelector('link[rel="' + rel + '"]') || document.createElement('link')
        var props = objLink[rel]
        var clone = el.cloneNode(true)
        var state = {}

        // Assign for each the props
        Object.keys(props).map(function (prop) {
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
        self.getHead().appendChild(el)
        state.after = el
        diff.push(state)
      })
    }
  }

  /**
   * Plugin | vue-head
   * 
   * @param  {Function} Vue
   * @param  {Object} options
   */
  function VueHead (Vue, options){
    if (installed) return

    installed = true

    if (options) {
      Vue.util.extend(opt, options)
    }

    Vue.mixin({
      ready: function () {
        let self = this
        let head = this.$options.head
        if (!head) return
        Object.keys(head).map(function (key) {
          if (head[key]) {
            let obj = (typeof head[key] === 'object') ? head[key] : head[key].bind(self)()
            util[key](obj)
          }
        })
      },
      destroyed: function () {
        let head = this.$options.head
        if (!head) return
        if (typeof head.undo === 'undefined' || head.undo) {
          util.undoTitle(diffTitle)
          util.undo(diff)
        }
        diff = []
      }
    })
  }

  VueHead.version = '1.0.4'

  // auto install
  if (typeof Vue !== 'undefined') {
    Vue.use(VueHead)
  }

  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = VueHead
  } else if(typeof define === 'function' && define.amd) {
    define(function () { return VueHead })
  } else if (typeof window !== 'undefined') {
    window.VueHead = VueHead
  }

})()