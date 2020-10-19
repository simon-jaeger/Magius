<template>
  <div class="noDirectory" @click="Store.load()">
    <button class="Button">Open directory</button>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"
  import Store from "@/services/Store"

  @Component
  export default class NoDirectory extends Vue {
    Store = Store
  }
</script>

<style scoped>
  .noDirectory {
    margin: 1rem;
    border: 1px solid var(--white3);
    min-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
