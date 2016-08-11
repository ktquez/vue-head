/* eslint-disable */
;(function() {

  'use strict'

  var opt = {
    complement: document.title,
    separator: '|'
  }

  var diffTitle = {}
  var els = []
  var installed = false

  var util = {
    /**
     * Shorthand
     * @type {Object}
     */
    shorthand: {
      ch: 'charset',
      tg: 'target',
      n: 'name',
      he: 'http-equiv',
      ip: 'itemprop',
      c: 'content',
      p: 'property',
      sc: 'scheme',
      r: 'rel',
      h: 'href',
      sz: 'sizes',
      t: 'type',
      s: 'src',
      a: 'async',
      d: 'defer',
      i: 'inner'
    },

    /**
     * This function return the element <head>
     * @type {Function}
     * @return {Object}
     */
    getPlace: function (place) {
      return document.getElementsByTagName(place)[0]
    },

    /**
     * Undo the document title for previous state
     * @type {Function}
     * @param  {Object} state 
     */
    undoTitle: function (state) {
      if (!state.before) return
      document.title = state.before
    },

    /**
     * Undo elements to its previous state
     * @type {Function}
     */
    undo: function () {
      if (!els.length) return
      els.map(function (el) {
        el.parentElement.removeChild(el)
      })
      els = []
    },

    /**
     * Set attributes in element
     * @type {Function}
     * @param  {Object} obj
     * @param  {HTMLElement} el
     * @return {HTMLElement} with defined attributes
     */
    prepareElement: function (obj, el) {
      var self = this
      Object.keys(obj).map(function (prop) {
        var sh = self.shorthand[prop] || prop
        if (sh.match(/(body|undo|replace)/g)) return
        if (sh === 'inner') {
          el.textContent = obj[prop]
          return
        }
        el.setAttribute(sh, obj[prop])
      })
      return el
    },

    /**
     * Change document title
     * @type {Function}
     * @param  {Object} obj
     */
    title: function (obj) {
      if (!obj) return
      diffTitle.before = opt.complement
      document.title = obj.inner + ' ' + (obj.separator || opt.separator) + ' ' +  (obj.complement || opt.complement)
    },

    /**
     * Handle of create elements
     * @type {Function}
     * @param  {Array} arr
     * @param  {String} tag   - style, link, meta, script, base
     * @param  {String} place - Default 'head'
     */
    handle: function (arr, tag, place) {
      var self = this
      if (!arr) return
      arr.map(function (obj) {
        var parent = self.getPlace(place)
        var el = document.getElementById(obj.id) || document.createElement(tag)
        // Elements that will substitute data
        if (el.hasAttribute('id')) {
          self.prepareElement(obj, el)
          return
        }
        // Other elements
        self.prepareElement(obj, el)
        // For script tags in body
        if (obj.body) parent = self.getPlace('body')
        // Add elements in Node
        parent.appendChild(el)
        // Fixed elements that do not suffer removal
        if (obj.undo !== undefined && !obj.undo) return
        // Elements which are removed
        els.push(el)
      })
    }
  }

  /**
   * Plugin | vue-head
   * @param  {Function} Vue
   * @param  {Object} options
   */
  function VueHead (Vue, options) {
    if (installed) return

    installed = true

    if (options) {
      Vue.util.extend(opt, options)
    }

    function init () {
      var self = this
      var head = self.$options.head
      if (!head) return
      Object.keys(head).map(function (key) {
        var prop = head[key]
        if (!prop) return
        var obj = (typeof prop === 'function') ? head[key].bind(self)() : head[key]
        if (key === 'title') {
          util[key](obj)
          return
        }
        util.handle(obj, key, 'head')
      })
      self.$emit('okHead')
    }

    function destroy () {
      if (!this.$options.head) return
      util.undoTitle(diffTitle)
      util.undo()
    }

    // v1
    if (Vue.version.match(/[1].(.)+/g)) {
      Vue.mixin({
        ready: function () {
          init.bind(this)()
        },
        destroyed: function () {
          destroy.bind(this)()
        }        
      })
    }
    // v2
    if (Vue.version.match(/[2].(.)+/g)) {
      Vue.mixin({
        mounted: function () {
          init.bind(this)()
        },
        destroyed: function () {
          destroy.bind(this)()
        }        
      })
    }
  }

  VueHead.version = '2.0.0'

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