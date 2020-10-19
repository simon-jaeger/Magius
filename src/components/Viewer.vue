<template>
  <div class="viewer" v-if="open">
    <img :src="items[current].url" alt="" class="item">
    <nav class="nav">
      <button @click="prev"></button>
      <button @click="next"></button>
    </nav>
    <header class="header">
      <span class="progress">{{ current+1 }} / {{ items.length }}</span>
      <button class="close" @click="hide"><i></i></button>
    </header>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class Viewer extends Vue {
    static self: Viewer
    items: Item[] = []
    open = false
    current = 0

    show(items: Item[], startAt = 0) {
      this.items = items
      this.current = startAt
      this.open = true
      window.addEventListener("keydown", this.initKeyboard)
      document.body.style.overflow = "hidden"
    }

    hide() {
      this.open = false
      window.removeEventListener("keydown", this.initKeyboard)
      document.body.style.overflow = ""
    }

    next() {
      this.current++
      if (this.current >= this.items.length) this.current = 0
    }

    prev() {
      this.current--
      if (this.current < 0) this.current = this.items.length - 1
    }

    initKeyboard(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") this.prev()
      else if (e.key === "ArrowRight") this.next()
      else if (e.key === "Escape") this.hide()
    }

    created() {
      Viewer.self = this
    }
  }
  if (module.hot) module.hot.decline()
</script>

<style scoped>
  .viewer {
    z-index: 100;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--black6);
  }

  .item {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }

  .nav {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .nav > button {
    cursor: default;
  }

  .header {
    position: absolute;
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--blackA);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .header:hover {
    opacity: 1;
  }

  .progress {
    padding: 1rem;
  }

  .close {
    width: 3rem;
    height: 3rem;
    text-align: center;
    color: var(--white4);
  }
  .close:hover {
    color: var(--white5);
  }
</style>
