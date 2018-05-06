import {
  getObjHead
} from './utils'

/**
 * Initializes the elements in the head
 * @type {Function}
 */
export function init () {
  let head = getObjHead.call(this)
  if (!head || !Object.keys(head).length) return
  console.log(head)
}

/**
 * Undo elements to its previous state
 * @type {Function}
 */
export function destroy () {
  this.$head.els.forEach(el => {
    el.parentElement.removeChild(el)
  })
  this.$head.els = []
}
