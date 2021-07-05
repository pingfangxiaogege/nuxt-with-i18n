<template>
  <div>
    <h1>{{$i18n.t('name')}}</h1>
    <button @click='change'>切换中英文</button>
  </div>
</template>

<script>
export default {
  methods: {
    change() {
      this.$i18n.locale = this.$i18n.locale === 'zh' ? 'en' : 'zh';
    }
  },
}
</script>
