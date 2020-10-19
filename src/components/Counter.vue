<template>
  <div style="display:flex; align-items:center;">
    <button @click="dec">--</button>
    <div style="width: 3rem; text-align:center;">{{ count }}</div>
    <button @click="inc">++</button>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class Counter extends Vue {
    @Prop({default: 0}) readonly initCount!: number
    count = this.initCount

    inc() {
      this.count++
    }

    dec() {
      this.count--
    }
  }
</script>

<style scoped>
</style>
