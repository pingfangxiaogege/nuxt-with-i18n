# 多种实现i18n国际化方式
主要依赖于<code>vue-i18n</code>插件

## 第一种方式：单纯使用vue-i18n
参考simple-i18n文件，主要在plugins中配置i18n。

```js
import { en, zh } from '../locales';
app.i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});
```
其中==locale==用于设置语言，==fallbackLocale==用于预设语言，==messages==是自己定义的语言数据。

### 使用方法

html
```html

<template>
  <div>
    <h1>{{$i18n.t('name')}} ---- {{$t('name')}}</h1>
    <button @click='change'>切换中英文</button>
  </div>
</template>
```
js
```js
change() {
  this.$i18n.locale = this.$i18n.locale === 'zh' ? 'en' : 'zh';
}
```

## 第二种方式：通过路由实现语言转换
我们时常在访问某某某官网时，在地址栏能看到==zh，en==等字样，大多数就是通过它们去控制语言的展示。在这里也实现了这种方式：参考==i18n-vuex==

这里同样需要配置i18n，plugins文件夹下面:
```js 
export default ({ app, store }) => {
  // Set i18n instance on app
  // This way we can use it in middleware and pages asyncData/fetch
  app.i18n = new VueI18n({
    locale: store.state.locale,
    fallbackLocale: 'en',
    // 你也可以写js文件，然后引入
    messages: {
      'en': require('@/locales/en.json'),
      'zh': require('@/locales/zh.json')
    }
  })

  app.i18n.path = (link) => {
    // 如果是默认语言，就省略
    if (app.i18n.locale === app.i18n.fallbackLocale) {
      return `/${link}`
    }
    return `/${app.i18n.locale}/${link}`
  }
}
```
这里需要注意的是locale的值需要改成：`store.state.locale`。

接下来是语言文件，位置如下：` locales/en.json`,` locales/zh.json`。
```json
{
  "home": {
    "name": "jiangpingfan",
    "introduction": "this is a man"
  }
}
```
然后这里有点不同的是<b>1.需要使用到vuex。 2.需要配置路由中间件</b>。
### vuex配置
它的作用主要是用于<b>限定和设置</b>语言的展示，例如说我只需要en和zh两种语言时，又在导航栏中输入fr或者其他语言简称时，项目就会运行出错，因为你根本没有配置该文件。

store/index.js
```js
export const state = () => ({
  locales: ['en', 'zh'],
  locale: 'en'
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  }
}
```
==state==和==mutations==不再赘述，其中的locales就是用来限定语种，locale用来设置语种，当需要修改语种时会进行语种的判断是否在可允许的范围内。


### 路由中间件
这里的文件十分重要，当进行路由切换时，都会运行到这里。
新建一个`i18n.js`文件，位于middleware文件夹下面。
```js
export default function({ isHMR, app, store, route, params, error, redirect }) {
  const defaultLocale = app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return
  // Get locale from params，query，default
  const locale = params.lang || route.query.lang || defaultLocale

  if (store.state.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
  // Set locale
  store.commit('SET_LANG', locale)
  app.i18n.locale = store.state.locale

  // 当路径为/en /zh时，并且是默认的语种匹配才会执行
  if (locale === defaultLocale && route.fullPath.indexOf('/' + defaultLocale) === 0) {
    const toReplace = '^/' + defaultLocale + (route.fullPath.indexOf('/' + defaultLocale + '/') === 0 ? '/' : '')
    const re = new RegExp(toReplace)
    return redirect(
      route.fullPath.replace(re, '/')
    )
  }
}
```
==app.i18n.fallbackLocale==在插件中的i18n里已经配置好了，==HMR==是在开发环境才会开启的，可以不用管，然后对当前语种的判断，这一步就是为了阻止用户输入不存在的语言。

```js
  const locale = params.lang || route.query.lang || defaultLocale

  if (store.state.locales.indexOf(locale) === -1) {
    return error({ message: 'This page could not be found.', statusCode: 404 })
  }
```
然后开始设置语种，这里的设置语种通过vuex还是有必要的。
```js
// Set locale
store.commit('SET_LANG', locale)
app.i18n.locale = store.state.locale
```
在进行i18n的插件配置时，语种的设置就是来自vuex，那是默认的展示，真正的设置语种的代码是`app.i18n.locale = store.state.locale`。
最后的代码就是对路径以及默认语种的判断然后进行一个重定向的操作，不再多说。

### 最后是nuxt配置
```js
router: {
  middleware: 'i18n'
},
plugins: [
  '~plugins/i18n.js'
],
// 指定运行npm run generate时生成的静态页面路径，（可选）
generate: {
  routes: ['/en', '/zh']
},
```
### 使用方法
```html
<template>
   <div>
      <h1> {{ $t('home.name') }} : {{$i18n.t('home.introduction')}}</h1>
      <button @click="change">切换中英文</button>
   </div>
</template>

<script>
export default {
  methods: {
    change() {
      this.$store.commit('SET_LANG', this.$store.state.locale === 'zh' ? 'en' : 'zh');
      // this.$router.push({name: this.$route.name, params: {lang: this.$store.state.locale}});
      this.$router.push({path: '/', query: {lang: this.$store.state.locale}});
    }
  },
}
</script>

```
有错的地方可以指正。
##结束