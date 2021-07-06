<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-btn
        color="primary"
        nuxt
      >
        {{$vuetify.lang.t('$vuetify.carousel.prev')}}
      </v-btn>
      <v-btn
        color="primary"
        nuxt
      >
        {{$vuetify.lang.t('$vuetify.key1')}}
         {{$vuetify.lang.t('$vuetify.namespace.key3')}}
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  mounted() {
    console.log(this.$vuetify)
  },
}
</script>
