<template>
  <div class="hints" v-show="hints.length">
    <button
      v-for="hint of hints"
      @keydown.down.prevent="focus(focused+1)"
      @keydown.tab.prevent="focus(focused+1)"
      @keydown.up.prevent="focus(focused-1)"
      @keydown.esc="input.focus()"
      @keydown.delete="input.focus()"
      @click="choose(hint)"
    >
      <i></i>{{ hint }}
    </button>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from "vue-property-decorator"

  @Component
  export default class Hints extends Vue {
    @Prop() readonly input!: HTMLInputElement
    @Prop() readonly hints!: string[]
    focused = 0

    focus(i = 0) {
      if (!this.hints.length) return
      if (i >= this.$el.children.length) i = 0
      if (i < 0) i = this.$el.children.length - 1
      this.focused = i
      ;(this.$el.children[i] as HTMLElement).focus()
    }

    choose(hint: string) {
      this.input.value = hint
      this.input.dispatchEvent(new Event("input"))
      this.input.dispatchEvent(new Event("submit"))
      this.input.focus()
    }
  }
</script>

<style scoped>
  .hints {
    position: absolute;
    z-index: 10;
    top: 3rem;
    left: 0;
    right: 0;
    min-width: 8rem;
    border-top: 2px solid var(--black5);
    margin-left: -2px;
    background-color: var(--black4);
    box-shadow: var(--shadow);
  }
  .hints > button {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3rem;
    width: 100%;
    padding-right: 1rem;
    padding-left: calc(1rem + 2px);
    white-space: nowrap;
  }
  .hints > button:hover {
    background-color: var(--black3);
  }
  .hints > button > i {
    user-select: none;
    width: 1rem;
    text-align: center;
    color: var(--white3);
  }
</style>
