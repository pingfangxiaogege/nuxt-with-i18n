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
