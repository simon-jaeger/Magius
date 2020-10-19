<template>
  <div
    class="menu"
    v-if="open"
    @click="close"
    v-click-away="close"
    :style="`top: ${y}px; left: ${x}px;`"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class Menu extends Vue {
    open = false
    x = 0
    y = 0

    show(x = 0, y = 0) {
      this.x = x
      this.y = y
      this.open = true
      // adust position if offscreen
      Vue.nextTick(() => {
        if (x + this.$el.clientWidth > document.documentElement.clientWidth)
          this.x -= this.$el.clientWidth
        if (y + this.$el.clientHeight > document.documentElement.clientHeight)
          this.y -= this.$el.clientHeight
      })
    }

    close() {
      this.open = false
    }
  }
</script>

<style scoped>
  .menu {
    position: fixed;
    z-index: 20;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.25rem;
    background-color: var(--black4);
    box-shadow: var(--shadow);
  }

  .menu > * {
    display: flex;
    width: 100%;
    height: 3rem;
    padding-right: 1.5rem;
    padding-left: 1.5rem;
    align-items: center;
    white-space: nowrap;
  }

  .menu > *:hover {
    background-color: var(--black3);
  }

  .menu > * >>> i {
    width: 1.3rem;
    margin-right: 1rem;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
