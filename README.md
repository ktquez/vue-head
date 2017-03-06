# vue-head

Manipulating the meta information of the head tag, a simple and easy way  
Motivated by [HEAD](https://github.com/joshbuchea/HEAD)

---

**For syntax of the previous version [click here](https://github.com/ktquez/vue-head/tree/v1.0.5)**

---

## Usage
**by CDN**
```html
...
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/*version*/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/*version*/vue-router.min.js"></script>
<script src="https://cdn.rawgit.com/ktquez/vue-head/master/vue-head.js"></script>
<script>
  // Code here
</script>
```
See how to use with [this example](https://github.com/ktquez/vue-head/blob/master/example/index.html)


**With NPM**
```shell
npm install vue-head --save
```

```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueHead from 'vue-head'

Vue.use(VueHead)
Vue.use(VueRouter)
...
```

## Examples (New syntax)
```javascript
var myComponent = Vue.extend({
  data: function () {
    return {
      ...
    }
  },
  head: {
    title: {
      inner: 'It will be a pleasure'
    },
    // Meta tags
    meta: [
      { name: 'application-name', content: 'Name of my application' },
      { name: 'description', content: 'A description of the page', id: 'desc' }, // id to replace intead of create element
      // ...
      // Twitter
      { name: 'twitter:title', content: 'Content Title' },
      // with shorthand
      { n: 'twitter:description', c: 'Content description less than 200 characters'},
      // ...
      // Google+ / Schema.org
      { itemprop: 'name', content: 'Content Title' },
      { itemprop: 'description', content: 'Content Title' },
      // ...
      // Facebook / Open Graph
      { property: 'fb:app_id', content: '123456789' },
      { property: 'og:title', content: 'Content Title' },
      // with shorthand
      { p: 'og:image', c: 'https://example.com/image.jpg' },
      // ...
    ],
    // link tags
    link: [
      { rel: 'canonical', href: 'http://example.com/#!/contact/', id: 'canonical' },
      { rel: 'author', href: 'author', undo: false }, // undo property - not to remove the element
      { rel: 'icon', href: require('./path/to/icon-16.png'), sizes: '16x16', type: 'image/png' }, 
      // with shorthand
      { r: 'icon', h: 'path/to/icon-32.png', sz: '32x32', t: 'image/png' },
      // ...
    ],
    script: [
      { type: 'text/javascript', src: 'cdn/to/script.js', async: true, body: true}, // Insert in body
      // with shorthand
      { t: 'application/ld+json', i: '{ "@context": "http://schema.org" }' },
      // ...
    ],
    style: [
      { type: 'text/css', inner: 'body { background-color: #000; color: #fff}', undo: false },
      // ...
    ]
  }
})
```

To learn more possibilities tags in [HEAD](https://github.com/joshbuchea/HEAD)

## Example with files .vue

```html
<template>
  <!-- Code here -->
</template>
```
```javascript
export default {
  data: function () {
    return {
      title: 'My Title'
    }
  },
  // Usage with context the component
  head: {
    // To use "this" in the component, it is necessary to return the object through a function
    title: function () {
      return {
        inner: this.title
      }
    },
    meta: [
      { name: 'description', content: 'My description', id: 'desc' }
    ]
  }
    ...
  }
}
```
```css
<style scoped>
  /* Code here */
</style>
```
For more questions, [check this example](https://github.com/ktquez/vue-head/blob/master/example/index.html)

## Custom title
You can customize the page title with tab and complement, just add the properties `separator` and `complement` object in title
Separator by default uses the pipe character `|` and complement by default uses the title of the html document  

```javascript
head: {
  title: {
    inner: 'My title',
    separator: '-',
    complement: 'My Complement'
  },
  //omited
}
```
*If not please complement defines an empty value*

## Default custom title
If you'd like to set default custom title options on every component you can pass options to VueHead when you're registering it for Vue, just like in example below.
```javascript
const VueHead = require('vue-head')

Vue.use(VueHead, {
  separator: '-',
  complement: 'My Complement'
})
```

## Using `this`
For using values with `this`, it is necessary to return the object through a function
```javascript
data: {
  myData: 'My description'
},
// omited
meta: function () {
  return [
    { name: 'description', content: this.myData }
  ]
}

``` 

## Undo elements
All created tags will be removed as you leave the component, but you may want it to be not broken and remain in the DOM.   
So you should set `undo: false`
```javascript
style: [
  { type: 'text/css', inner: 'body { background-color: #000; color: #fff}', undo: false }
]
```

## Replace content the elements
There are some tags that are unique and that only need to update the content, such as meta tags `name="description"` or `rel="canonical"`.  
Therefore, it is necessary to define a `id`, so that the element is found and is made the update correctly, avoiding duplicates tags.  
```javascript
meta: [
  { name: 'description', content: 'A description of the page', id: 'desc' }
]
```

## Event emitted 
### Vue 1.*
At some point you may want to do something after the DOM is complete with the changes, to this the vue-head emits through the key `okHead`.  
With this, you can hear through the `events` option of your instance component.
```javascript
// omited
events: {
  okHead: function () {
    // Do something
  }
},
```
### Vue 2.*
```javascript
created: function () {
  this.$on('okHead', function () {
    // Do Something
  });
}
```

## Update elements with asynchronous data or after page loaded
Keep the data tags updated through an update of the elements that have changed data, which are the reactive data of your component.
It is not automatic if you want to upgrade, simply issue the event `updateHead` soon after changing your data.

For example:  
```javascript
// omited
methods: {
  getAsyncData: function () {
    var self = this
    window.setTimeout(function () {
      self.title = 'My async title'
      self.$emit('updateHead')
    }, 3000)
  }
},
```

***Note: I recommend you use the vueRouter to request the data from the tags and build the header tags with synchronous data, updating real-time meta tags only have to use the business rules of your application.***


## Keep alive
Supported only in Vue next >2.0.*, Because it uses the new hooks activated and deactivated.  
*Obs: In version <1.0. * Using making prompt to maintain the element in the document.* 


## Shorthand property

property        | shorthand     | used tags
--------------- | ------------- | ------------
charset         | `ch`          | `meta`
target          | `tg`          | `base` 
name            | `n`           | `meta`
http-equiv      | `he`          | `meta`
itemprop        | `ip`          | `meta`
content         | `c`           | `meta`
property        | `p`           | `meta`
rel             | `r`           | `link`
href            | `h`           | `link`
sizes           | `sz`          | `link`
type            | `t`           | `link` `style`  `script`
scheme          | `sc`          | `script`
src             | `s`           | `script`
async           | `a`           | `script`
defer           | `d`           | `script`
inner           | `i`           | `script` `style` 

## Support 
- Vue.js 2.0.*
- Vue.js 1.0.*

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session readme.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**thank you**



