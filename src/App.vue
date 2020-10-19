<template>
  <div v-if="ready" @dragover.prevent @drop="importItems">
    <Header/>
    <Gallery v-if="Store.dirSet"/>
    <NoDirectory v-else/>
    <Viewer/>
    <Toast/>

    <ModalEditTags/>
    <ModalManageTags/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import Header from "@/components/Header.vue"
  import Gallery from "@/components/Gallery.vue"
  import Toast from "@/components/Toast.vue"
  import Viewer from "@/components/Viewer.vue"
  import ModalEditTags from "@/components/ModalEditTags.vue"
  import ModalManageTags from "@/components/ModalManageTags.vue"
  import Store from "@/services/Store"
  import NoDirectory from "@/components/NoDirectory.vue"
  import Filter from "@/services/Filter"

  @Component({
    components: {
      NoDirectory,
      ModalManageTags,
      ModalEditTags,
      Viewer,
      Toast,
      Gallery,
      Header,
    },
  })
  export default class App extends Vue {
    ready = false
    Store = Store

    async importItems(e: DragEvent) {
      e.preventDefault()
      if (!Store.dirSet) return
      await Store.importItems([...e.dataTransfer!.files])
      Filter.tags = []
      window.scrollTo(0, 0)
      Toast.self.show("Files imported")
    }

    mounted() {
      setTimeout(() => this.ready = true, 100) // avoid flickering on startup
    }
  }
</script>

<style scoped>
</style>
