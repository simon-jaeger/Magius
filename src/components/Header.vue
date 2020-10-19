<template>
  <header class="header">
    <TextField style="flex: 1;">
      <i></i>
      <div
        v-if="Filter.tags.length"
        style="display:flex; justify-content: flex-start; gap: 0.5rem;"
      >
        <button
          class="Chip"
          v-for="tag of Filter.tags"
          @click="removeTag(tag)"
        >{{ tag }} <i></i></button>
      </div>
      <input
        v-model="search"
        ref="input"
        v-space-to-underscore
        @keydown.enter="chooseTag(search)"
        @keydown.tab.prevent="chooseTag(search)"
        @submit="chooseTag(search)"
        @keydown.delete="popTag"
        @keydown.down.prevent="$refs.hints.focus()"
        type="text"
        spellcheck="false"
        placeholder="Search..."
        aria-label="search"
      >
      <Hints
        ref="hints"
        :input="$refs.input"
        :hints="hints"
      />
    </TextField>
    <button class="dot" @click="menu.show()"><i></i></button>
    <Menu ref="menu" style="top: 5rem; right: 1rem; left:auto;">
      <button @click="Store.load()">
        <i></i>Open
      </button>
      <button @click="ModalManageTags.self.show()">
        <i></i>Tags
      </button>
      <button @click="shell.openExternal('https://github.com/simon-jaeger/Magius')">
        <i></i>About
      </button>
    </Menu>
  </header>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from "vue-property-decorator"
  import {shell} from "electron"
  import TextField from "@/components/TextField.vue"
  import Toast from "@/components/Toast.vue"
  import Filter from "@/services/Filter"
  import Store from "@/services/Store"
  import Hints from "@/components/Hints.vue"
  import * as u from "@/utils/utilFunctions"
  import Menu from "@/components/Menu.vue"
  import ModalManageTags from "@/components/ModalManageTags.vue"

  @Component({
    components: {Menu, Hints, TextField},
  })
  export default class Header extends Vue {
    @Ref() readonly menu!: Menu
    shell = shell
    Filter = Filter
    Store = Store
    ModalManageTags = ModalManageTags
    search = ""

    get hints() {
      if (!this.search) return []
      return Store.tags.filter(x => !Filter.tags.includes(x) && x.startsWith(this.search))
    }

    chooseTag(tag: string) {
      if (!this.hints.length) return
      Filter.tags.push(this.hints[0])
      this.search = ""
    }

    popTag() {
      if (this.search) return
      Filter.tags.pop()
    }

    removeTag(tag: string) {
      u.remove(Filter.tags, tag)
    }
  }
</script>

<style scoped>
  .header {
    position: sticky;
    z-index: 10;
    top: 0;
    padding: 1rem 0 1rem 1rem;
    display: flex;
    background-color: var(--black5);
  }

  .dot {
    width: 4rem;
    height: 3rem;
    text-align: center;
    color: var(--white4);
  }
  .dot:hover {
    color: var(--white5);
  }
</style>
