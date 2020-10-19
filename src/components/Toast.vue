<template>
  <div class="toast" :class="{open}">
    <i style="color:var(--white3);"></i>
    <span>{{ msg }}</span>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator"

  @Component
  export default class Toast extends Vue {
    static self: Toast
    open = false
    msg = ""
    timeout

    show(msg) {
      clearTimeout(this.timeout)
      this.open = true
      this.msg = msg
      this.timeout = setTimeout(() => {
        this.open = false
      }, 4000)
    }

    created() {
      Toast.self = this
    }
  }
  if (module.hot) module.hot.decline()
</script>

<style scoped>
  .toast {
    position: fixed;
    bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 3rem;
    padding: 0 1rem;
    background-color: var(--black4);
    box-shadow: var(--shadow);
    opacity: 0;
    transform: translateY(1rem);
    transition: all 0.3s;
  }
  .open {
    transform: translateY(0);
    opacity: 1;
  }
</style>
