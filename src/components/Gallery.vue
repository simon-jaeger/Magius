<template>
  <div>
    <div class="gallery" @dragstart="dragOut">
      <button
        v-for="(item, i) of filteredItems"
        :key="item.url"
        :data-i="i"
        @click.exact="Viewer.self.show(filteredItems, +i)"
        @click.right.prevent="showMenu(item, $event)"
        class="item"
      >
        <img :src="item.url" loading="lazy" alt="" :title="item.tags.join(' ')">
      </button>
    </div>

    <Menu ref="menu">
      <button @click="Viewer.self.show(selection)"><i></i>View</button>
      <button @click="ModalEditTags.self.show(selection)"><i></i>Tags</button>
      <button @click="modalDelete.show()"><i></i>Delete</button>
    </Menu>

    <Modal ref="modalDelete" title="Delete confirmation" centered>
      You are about to delete <strong>{{ selection.length }}</strong>
      {{ selection.length > 1 ? "files" : "file" }}.<br>
      Are you sure?
      <template slot="actions">
        <button @click="modalDelete.hide()" class="Button Button-text">
          Cancel
        </button>
        <button @click="destroySelectedItems" class="Button Button-red">
          Delete
        </button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
  import {Component, Ref, Vue, Watch} from "vue-property-decorator"
  import {ipcRenderer} from "electron"
  import Store from "@/services/Store"
  import Viewer from "@/components/Viewer.vue"
  import Filter from "@/services/Filter"
  import Menu from "@/components/Menu.vue"
  import ModalEditTags from "@/components/ModalEditTags.vue"
  import DragSelect from "dragselect"
  import Toast from "@/components/Toast.vue"
  import Modal from "@/components/Modal.vue"

  @Component({
    components: {Modal, Menu},
  })
  export default class Gallery extends Vue {
    @Ref() readonly menu!: Menu
    @Ref() readonly modalDelete!: Modal
    Store = Store
    Filter = Filter
    Viewer = Viewer
    ModalEditTags = ModalEditTags
    selection: Item[] = []
    dragSelect!: DragSelect

    get filteredItems(): Item[] {
      if (!Filter.tags.length) return Store.items
      return Store.items.filter(item => Filter.tags.every(tag => item.tags.includes(tag)))
    }

    showMenu(item: Item, e: MouseEvent) {
      if (!this.selection.includes(item)) {
        this.dragSelect.setSelection([e.currentTarget as HTMLElement], true)
      }
      this.menu.show(e.x, e.y)
    }

    @Watch("Filter", {deep: true})
    @Watch("Store.items")
    clearSelection() {
      this.selection = []
      this.dragSelect.clearSelection()
      Vue.nextTick(() => this.dragSelect.setSelectables(this.$el.querySelectorAll(".item")))
    }

    initDragSelect() {
      this.dragSelect = new DragSelect({
        area: this.$el.querySelector(".gallery") as HTMLElement,
        selectables: this.$el.querySelectorAll(".item"),
        customStyles: true,
        multiSelectKeys: ["ctrlKey"],
        onDragStartBegin: (e) => {
          if (e.target !== e.currentTarget && !e.ctrlKey) this.dragSelect.break()
        },
        callback: (elements) => {
          this.selection = elements // @ts-ignore
            .sort((a, b) => a.dataset.i - b.dataset.i) // @ts-ignore
            .map(e => this.filteredItems[e.dataset.i])
        },
      })
    }

    destroySelectedItems() {
      Store.destroyItems(this.selection)
      this.clearSelection()
      this.modalDelete.hide()
      Toast.self.show("Files deleted")
    }
    
    dragOut(e:DragEvent) {
      e.preventDefault()
      if (!this.selection.length) return
      ipcRenderer.send('ondragstart', this.selection.map(x => x.path))
    }

    mounted() {
      this.initDragSelect()
    }
  }
</script>

<style scoped>
  .gallery {
    min-height: calc(100vh - 5rem);
    padding: 2rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    align-content: start;
    gap: 2rem;
    user-select: none;
    -webkit-user-drag: none;
  }

  .item {
    position: relative;
    padding-bottom: 100%;
    background-color: var(--black6);
  }
  .item:hover {
    box-shadow: 0 0 0 1px var(--cyan5);
  }
  .item:focus {
    /* no focus style */
  }
  .item > img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>

<style>
  .ds-selector {
    z-index: 10;
    background: rgba(166, 201, 255, 0.2);
    border: 1px solid var(--cyan5);
  }
  .item.ds-selected,
  .item.ds-selected:hover {
    box-shadow: 0 0 0 1px var(--cyan5), 0 0 0 1rem rgba(166, 201, 255, 0.2);
  }
  .item.ds-selected::after {
    content: '';
    font-family: 'FontAwesome', sans-serif;
    font-weight: 900;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    position: absolute;
    left: 0.25rem;
    bottom: 0.25rem;
    display: flex;
    width: 1.5rem;
    height: 1.5rem;
    justify-content: center;
    align-items: center;
    border-radius: 9999px;
    background-color: var(--blackA);
    color: var(--cyan5);
  }
</style>
