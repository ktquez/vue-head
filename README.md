# vue-head

Manipulating the meta information of the head tag, a simple and easy way  
Motivated by [HEAD](https://github.com/joshbuchea/HEAD)

## Usage
**by CDN**
```html
...
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.24/vue.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/0.7.13/vue-router.min.js"></script>
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

## Examples
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
    meta: {
      // Basic meta
      name: {
        'application-name': 'Name of my application',
        description: 'A description of the page',
        // Twitter
        'twitter:title': 'Content Title',
        'twitter:description': 'Content description less than 200 characters',
        'twitter:image': 'https://example.com/image.jpg'
      },
      // Google+ / Schema.org
      itemprop: {
        name: 'Content Title',
        description: 'Content description less than 200 characters',
        image: 'https://example.com/image.jpg'
      },
      // Facebook / Open Graph
      property: {
        'fb:app_id': 123456789,
        'og:url': 'https://example.com/page.html',
        'og:title': 'Content Title',
        'og:description': 'Description Here',
        'og:image': 'https://example.com/image.jpg'
      }    
    }
    // Examples of link tags
    link: {
      canonical: {
        href: 'http://example.com/#!/contact/'          
      },
      author: {
        href: 'humans.txt'
      },
      stylesheet: {
        href: 'https://example.com/styles.css'
      }
      import: {
        href: 'component.html'
      }
    }
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
    title: function () {
      return {
        // To use "this" in the component, it is necessary to return the object through a function
        inner: this.title
      }
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

## Contributing
- Check the open issues or open a new issue to start a discussion around your feature idea or the bug you found.
- Fork repository, make changes, add your name and link in the authors session readme.md
- Send a pull request

If you want a faster communication, find me on [@ktquez](https://twitter.com/ktquez)

**thank you**



