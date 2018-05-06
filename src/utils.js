import {
  SHORTHANDS
} from './constants'

/**
 * Retrive object head
 * @type {Function}
 * @param {Object} context
 * @param {Function|Object} target
 * @return {Object}
 */
export function getObjHead () {
  let target = this.$options.head
  return (typeof target === 'function') ? target.call(this) : target
}
