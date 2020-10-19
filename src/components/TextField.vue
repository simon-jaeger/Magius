<template>
  <div class="textField" @click="focus">
      <slot></slot>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class TextField extends Vue {
    focus() {
      this.$el.querySelector("input")?.focus()
    }
  }
</script>

<style scoped>
  .textField {
    position: relative;
    width: 100%;
    flex-basis: 0;
    display: flex;
    gap: 1rem;
    align-items: center;
    height: 3rem;
    padding-right: 1rem;
    padding-left: 1rem;
    border-left: 2px solid var(--white3);
    background-color: var(--black4);
    box-shadow: var(--shadow);
    white-space: nowrap;
  }
  .textField:focus-within {
    border-left-color: var(--indigo5);
  }

  .textField > input {
    flex: 1;
  }

  .textField > i {
    user-select: none;
    width: 1rem;
    text-align: center;
    color: var(--white3);
  }
</style>
