/* eslint-disable */
;(() => {

  'use strict'

  const opt = {
    cpl: document.title,
    separator: '|'
  }

  const diffTitle = {}
  let els = []
  let installed = false

  const util = {
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
    getPlace (place) {
      return document.getElementsByTagName(place)[0]
    },

    /**
     * Undo the document title for previous state
     * @type {Function}
     * @param  {Object} state 
     */
    undoTitle (state) {
      if (!state.before) return
      document.title = state.before
    },

    /**
     * Undo elements to its previous state
     * @type {Function}
     */
    undo () {
      if (!els.length) return
      els.map(el => {
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
    prepareElement (obj, el) {
      Object.keys(obj).map(prop => {
        let sh = (this.shorthand[prop] || prop)
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
     * @param  {Object} val
     */
    title (val) {
      if (!val) return
      diffTitle.before = opt.cpl
      document.title = `${val.inner} ${val.separator || opt.separator} ${val.cpl || opt.cpl}`
    },

    /**
     * Handle of create elements
     * @type {Function}
     * @param  {Array} arr
     * @param  {String} tag   - style, link, meta, script, base
     * @param  {String} place - Default 'head'
     */
    handle (arr, tag, place) {
      if (!arr) return
      arr.map(obj => {
        let parent = this.getPlace(place)
        let el = document.getElementById(obj.id) || document.createElement(tag)
        // Elements that will substitute data
        if (el.hasAttribute('id')) {
          this.prepareElement(obj, el)
          return
        }
        // Other elements
        this.prepareElement(obj, el)
        // For script tags in body
        if (obj.body) parent = this.getPlace('body')
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
  const VueHead = (Vue, options) => {
    if (installed) return

    installed = true

    if (options) {
      Vue.util.extend(opt, options)
    }

    function init () {
      let head = this.$options.head
      if (!head) return
      Object.keys(head).map(key => {
        let prop = head[key]
        if (!prop) return
        let obj = (typeof prop === 'function') ? head[key].bind(this)() : head[key]
        if (key === 'title') {
          util[key](obj)
          return
        }
        util.handle(obj, key, 'head')
      })
      this.$emit('okHead')
    }

    function destroy (head) {
      if (!head) return
      util.undoTitle(diffTitle)
      util.undo()
    }

    // v1
    if (Vue.version.match(/[1].(.)+/g)) {
      Vue.mixin({
        ready () {
          init.bind(this)()
        },
        destroyed () {
          destroy(this.$options.head)
        }        
      })
    }
    // v2
    if (Vue.version.match(/[2].(.)+/g)) {
      Vue.mixin({
        activated () {
          init.bind(this)()
        },
        deactivated () {
          destroy(this.$options.head)
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