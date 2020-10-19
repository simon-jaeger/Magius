<template>
  <div
    style="display:flex; gap: 0.5rem; overflow-x:hidden;"
    :style="urlset.length <= 2 ? 'justify-content:center;' : ''"
  >
    <img
      style="height: 8rem;"
      v-for="url of urlset"
      alt=""
      :src="url"
    >
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class ImgSet extends Vue {
    @Prop({required: true}) readonly urlset!: string[]
  }
</script>

<style scoped>
</style>
