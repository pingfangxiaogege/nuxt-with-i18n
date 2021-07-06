import Vue from 'vue';
import VueI18n from 'vue-i18n';

// 语言文件
import en from '../locales/en';
import zhHans from 'vuetify/es5/locale/zh-Hans';

Vue.use(VueI18n);

export default ({ app, store }) => {
  // Set i18n instance on app
  app.i18n = new VueI18n({
    locale: 'zhHans',
    messages: {
      en: {$vuetify: en},
      zhHans: {$vuetify: zhHans},
    }, // set locale messages
  });
}
