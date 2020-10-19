<template>
  <div v-if="open" class="modal" @click.self="hide">
    <div class="inner" :style="centered ? 'margin-top:auto;' : ''">
      <header class="header">
        <h2 class="title">{{ title }} <small v-if="titleSuffix">({{ titleSuffix }})</small></h2>
        <button class="close" @click="hide"><i></i></button>
      </header>
      <div class="lead">
        <slot name="lead"></slot>
      </div>
      <div class="body">
        <slot></slot>
      </div>
      <footer class="actions">
        <slot name="actions"></slot>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator"

  @Component
  export default class Modal extends Vue {
    @Prop({default: "Modal"}) readonly title!: string
    @Prop() readonly titleSuffix!: string | null
    @Prop({default: false}) readonly centered!: boolean
    open = false

    show() {
      this.open = true
      Vue.nextTick(() => {
        this.$el.querySelector("input")?.select()
      })
    }

    @Watch("$route")
    hide() {
      if (!this.open) return
      this.open = false
      this.$el.querySelectorAll("input").forEach(x => {
        x.value = "" // clear entered values
        x.dispatchEvent((new Event("input"))) // trigger v-model sync
      })
    }
  }
</script>

<style scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    padding: 8rem 2rem;
    background-color: var(--blackA);
  }

  .inner {
    max-height: calc(100vh - 16rem);
    display: flex;
    flex-direction: column;
    margin: 0 auto auto auto;
    position: relative;
    width: 28rem;
    border-style: solid;
    border-width: 1px;
    border-color: var(--black4);
    border-radius: 0.25rem;
    background-color: var(--black5);
  }

  .header {
    padding: 1rem 3.5rem 1rem 1rem;
    border-bottom: 1px solid var(--black4);
  }

  .title {
    font-weight: 500;
  }

  .title > small {
    display: inline-block;
    color: var(--white4);
    font-weight: normal;
  }

  .close {
    position: absolute;
    left: auto;
    top: 0;
    right: 0;
    bottom: auto;
    display: flex;
    width: 3.5rem;
    height: 3.5rem;
    justify-content: center;
    align-items: center;
    color: var(--white3);
  }
  .close:hover {
    color: var(--white5);
  }

  .lead {
    padding: 1rem;
    border-bottom: 1px solid var(--black4);
  }
  .lead:empty {
    display: none;
  }

  .body {
    flex-shrink: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    justify-content: flex-end;
    border-top: 1px solid var(--black4);
  }
  .actions:empty {
    display: none;
  }
</style>
