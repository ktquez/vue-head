(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueHead = factory());
}(this, (function () { 'use strict';

  var version = "3.0.0";

  var OPTIONS = {
    title: {
      complement: window.document.title,
      separator: '|'
    },
    attr: 'data-head'
  };

  /**
   * Retrive object head
   * @type {Function}
   * @param {Object} context
   * @param {Function|Object} target
   * @return {Object}
   */
  function getObjHead() {
    var target = this.$options.head;
    return typeof target === 'function' ? target.call(this) : target;
  }

  /**
   * Initializes the elements in the head
   * @type {Function}
   */
  function init() {
    var head = getObjHead.call(this);
    if (!head || !Object.keys(head).length) return;
    console.log(head);
  }

  /**
   * Undo elements to its previous state
   * @type {Function}
   */
  function destroy() {
    this.$head.els.forEach(function (el) {
      el.parentElement.removeChild(el);
    });
    this.$head.els = [];
  }

  function mixin(Vue) {
    if (Vue.version.match(/[1].(.)+/g)) {
      return {
        ready: function ready() {
          init.call(this);
        },
        destroyed: function destroyed() {
          destroy.call(this);
        }
      };
    }
    // For >=2 Vue version
    return {
      mounted: function mounted() {
        init.call(this);
      },
      beforeDestroy: function beforeDestroy() {
        destroy.call(this);
      }
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function VueHead(Vue, options) {
    Vue.mixin(mixin(Vue));

    Object.defineProperty(Vue.prototype, '$head', {
      options: _extends({}, OPTIONS, options)
    });
  }

  VueHead.version = version;

  // auto install
  if (typeof window !== 'undefined' && typeof window.Vue !== 'undefined') {
    window.Vue.use(VueHead);
  }

  return VueHead;

})));
