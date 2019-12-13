/* eslint-disable */
;(function() {

  'use strict'

  var opt = {
    complement: window.document.title,
    separator: '|'
  }

  var diffTitle = {}
  var els = []
  var diffEls = []
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
      return window.document.getElementsByTagName(place)[0]
    },

    /**
     * Undo the window.document title for previous state
     * @type {Function}
     * @param  {Object} state
     */
    undoTitle: function (state) {
      if (!state.before) return
      window.document.title = state.before
    },

    /**
     * Undo elements to its previous state
     * @type {Function}
     */
    undo: function () {
      if (!els.length) return
      els.forEach(function (el) {
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
      Object.keys(obj).forEach(function (prop) {
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
     * Change window.document title
     * @type {Function}
     * @param  {Object} obj
     */
    title: function (obj) {
      if (!obj) return
      diffTitle.before = opt.complement
      var title = obj.inner + ' ' + (obj.separator || opt.separator) +
        ' ' +  (obj.complement || opt.complement)
      window.document.title = title.trim()
    },

    /**
     * Update Element
     */
    update: function () {
      if (!els.length) return
      els.forEach(function(el, key) {
        if (diffEls[key] && !diffEls[key].isEqualNode(el)) {
          el.parentElement.replaceChild(diffEls[key], els[key])
          els.splice(key, 1, diffEls[key])
          return
        }
      })
      diffEls = []
    },

    /**
     * Add Elements
     * @param {Object} obj
     * @param {HTMLElement} el
     * @param {HTMLElement} parent
     */
    add: function (obj, el, parent) {
      parent.appendChild(el)
      // Fixed elements that do not suffer removal
      if (obj.undo !== undefined && !obj.undo) return
      // Elements which are removed
      els.push(el)
    },

    /**
     * Handle of create elements
     * @type {Function}
     * @param  {Array} arr
     * @param  {String} tag   - style, link, meta, script, base
     * @param  {String} place - Default 'head'
     * @param  {Boolean} update
     */
    handle: function (arr, tag, place, update) {
      var self = this
      if (!arr) return
      arr.forEach(function (obj) {
        var parent = (obj.body) ? self.getPlace('body') : self.getPlace(place)
        var el = window.document.getElementById(obj.id)
        if (!el) {
          el = window.document.createElement(tag)
          update = false
        }
        // Elements that will substitute data
        if (el.hasAttribute('id')) {
          self.prepareElement(obj, el)
          return
        }
        // Other elements
        el = self.prepareElement(obj, el)
        // Updated elements
        if (update) {
          diffEls.push(el)
          return
        }
        // Append Elements
        self.add(obj, el, parent)
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

    /**
     * Initializes and updates the elements in the head
     * @param  {Boolean} update
     */
    function init (update) {
      var self = this
      var head = (typeof self.$options.head === 'function') ? self.$options.head.bind(self)() : self.$options.head
      if (!head) return
      Object.keys(head).forEach(function (key) {
        var prop = head[key]
        if (!prop) return
        var obj = (typeof prop === 'function') ? head[key].bind(self)() : head[key]
        if (key === 'title') {
          util[key](obj)
          return
        }
        util.handle(obj, key, 'head', update)
      })
      self.$emit('okHead')
    }

    /**
     * Remove the meta tags elements in the head
     */
    function destroy () {
      if (!this.$options.head) return
      util.undoTitle(diffTitle)
      util.undo()
    }

    // v1
    if (Vue.version.match(/[1].(.)+/g)) {
      Vue.mixin({
        ready: function () {
          init.call(this)
        },
        destroyed: function () {
          destroy.call(this)
        },
        events: {
          updateHead: function () {
            init.call(this, true)
            util.update()
          }
        }
      })
    }
    // v2
    if (Vue.version.match(/[2].(.)+/g)) {
      Vue.mixin({
        created: function () {
          var self = this
          self.$on('updateHead', function () {
            init.call(this, true)
            util.update()
          })
        },
        mounted: function () {
          init.call(this)
        },
        beforeDestroy: function () {
          destroy.call(this)
        }
      })
    }
  }

  VueHead.version = '2.2.0'

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
