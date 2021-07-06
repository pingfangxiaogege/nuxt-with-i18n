# vuetify-i18n

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

# vuetify实现i18n
在vuetify中，它本身已经封装好了国际化，我们可以直接使用，默认是使用en，包含部分组件的文字翻译，也可以自定义翻译文件。
Vuetify提供的语言翻译请查阅：[i18n](https://vuetify.cn/zh-Hans/customization/internationalization/)

### 安装vuetify
可以在创建nuxt应用时，选择vuetify作为UI组件库自动安装。
手动安装如下：
```js
npm install @nuxtjs/vuetify -D

// 更新nuxt配置文件
buildModules: [
  // Simple usage
  '@nuxtjs/vuetify',

  // 或者 With options
  ['@nuxtjs/vuetify', { /* module options */ }]
]
```

### 使用方法
修改index.vue文件为一下内容：
```v
<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-btn
        color="primary"
        nuxt
      >
        {{$vuetify.lang.t('$vuetify.carousel.prev')}}
      </v-btn>
    </v-col>
  </v-row>
</template>
```
由于vuetify是使用`en`作为默认语言，`carousel.prev`也是组件内置的，所以在页面展示的是`Previous visual`。

### 中文配置
添加vuetify自定义配置文件，修改nuxt配置。参考：[@nuxtjs/vuetify](https://www.npmjs.com/package/@nuxtjs/vuetify)。
```js
// nuxt.config.js
vuetify: {
  customVariables: ['~/assets/variables.scss'],
  optionsPath: './vuetify.option.js',
}

// 新建vuetify.option.js
import zhHans from 'vuetify/es5/locale/zh-Hans'; // 引入配置文件
import en from 'vuetify/es5/locale/en';

export default function({app}) {
  return {
    lang: {
      locales: { zhHans, en},
      current: 'zhHans',
    }
  }
}
```
vuetify内置很多的语言翻译文件，我们可以直接引入，将`current`修改为中文`zhHans`再刷新页面，你会发现那个按钮的文字变成了<b>上一张</b>。


### 添加自定义翻译文件
从上面看到的都是，vuetify内置的翻译，如果我想添加自己的翻译呢？vuetify官网也给出了答案。

新建一个文件`/locales/en.js`, 代码如下：
```js
import en from 'vuetify/es5/locale/en';

export default {
  ...en,

  key1: "key 1 internationalization",
  key2: "key 2 internationalization",

  namespace: {
    key3: "key 3 internationalization"
  }
}
```
修改vuefify.option.js文件，替换en语言文件，代码如下：
```js
import zhHans from 'vuetify/es5/locale/zh-Hans';
import en from '~/locales/en';  // 修改为自己的文件

export default function({app}) {
  return {
    lang: {
      locales: { zhHans, en},
      current: 'en',
    }
  }
}
```
这里current修改为en，因为暂时还没有添加中文翻译文件。

### 使用方法
```html
<v-btn
  color="primary"
  nuxt
>
  {{$vuetify.lang.t('$vuetify.key1')}}
  {{$vuetify.lang.t('$vuetify.namespace.key3')}}
</v-btn>
```
运行代码可查看结果，其他语种翻译亦是如此。

### 手动切换中英文翻译
只需要一句代码，修改current的值即可。
```js
methods: {
  changeLocale () {
    this.$vuetify.lang.current = 'zhHans';
  },
},
```

### vuetify结合i18n
基本上使用vuetify已经可以满足大多数的要求，如果想要更高级的国际化的功能可以结合i18n。

安装vue-i18n：`npm install --save vue-i18n`
引入i18n: `import VueI18n from 'vue-i18n';`
修改vuetify.option.js:
```js
import zhHans from 'vuetify/es5/locale/zh-Hans';
import en from '~/locales/en';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zhHans', // set locale
  messages: {
    en: {$vuetify: en},
    zhHans: {$vuetify: zhHans},
  }, // set locale messages
})
console.log(i18n)
export default function({app}) {
  return {
    lang: {
      t: (key, ...params) => i18n.t(key, params),
    }
  }
}
```
到这里已经可以结合i18n实现翻译了，接下来做点优化。

提取i18n，修改为插件方式：在plugins目录下新建i18n.js文件，在nuxt.config.js中引入，此处不在多述。自行查阅。

<b>i18n.js文件代码如下：</b>
```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// 语言文件
import en from '../locales/en';
import zhHans from 'vuetify/es5/locale/zh-Hans';

Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: {$vuetify: en},
      zhHans: {$vuetify: zhHans},
    }, // set locale messages
  });
}

```
需要注意的是在messages对象中的属性值需要多加一层<b>`$vuetify`</b>,否则将不能翻译vuetify的组件语言。

### 使用方式
使用方式不变，修改当前语言配置:`this.$i18n.lang.current='en';`