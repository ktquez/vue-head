import Vue from 'vue'
import VueHead from '../vue-head-es6'
describe('cient#VueHead', function () {
  beforeAll(() => {
    const complement = 'My Complement'

    Vue.use(VueHead, {
      separator: '-',
      complement
    })
  })

  it('should render title success', function () {
    const app = new Vue({
      render: h => h('div', { attrs: {id: 'app'} }),
      head: () => {
        return {title: {inner: 'test'}}
      }
    })

    app.$mount()
    expect(window.document.title).toBe('test - My Complement')
  })

  it('should inject meta data success', function () {
    const app = new Vue({
      render: h => h('div', { attrs: {id: 'app'} }),
      head: {
        meta: [
          {name: 'description', content: 'A description of the page', id: 'desc' }
        ]
      }
    })

    app.$mount()
    expect(getMetaByName('description').getAttribute('content')).toBe('A description of the page')
    expect(getMetaByName('description').getAttribute('id')).toBe('desc')
  })

  it('should inject style success', function () {
    const app = new Vue({
      render: h => h('div', { attrs: {id: 'app'} }),
      head: {
        style: [
          {type: 'text/css', inner: 'body { background-color: #000; color: #fff }'}
        ]
      }
    })

    app.$mount()
    expect(window.document.getElementsByTagName('style')[0].innerHTML).toBe('body { background-color: #000; color: #fff }')
  })

  it('should replace current link success', function () {
    const app = new Vue({
      render: h => h('div', { attrs: {id: 'app'} }),
      head: {
        link: [
          {rel: 'author', href: 'author'}
        ]
      }
    })

    app.$mount()
    expect(window.document.getElementsByTagName('link')[0].getAttribute('href')).toBe('author')
    expect(window.document.getElementsByTagName('link')[0].getAttribute('rel')).toBe('author')
  })
})

function getMetaByName (name, type = 'meta') {
  const metas = window.document.getElementsByTagName('meta')
  return Array.prototype.find.call(metas, (meta) => {
    return meta.getAttribute('name') === name
  })
}
