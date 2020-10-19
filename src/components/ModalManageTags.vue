<template>
  <div style="display: contents;">
    <Modal
      ref="modal"
      title="Manage tags"
    >

      <TextField style="margin-bottom: 1.5rem;">
        <i></i>
        <input
          v-model="filterInput"
          v-space-to-underscore
          type="text"
          spellcheck="false"
          placeholder="Filter..."
          aria-label="filter"
        >
      </TextField>
      <div v-if="filteredTags.length" style="display: grid; grid-gap: 1rem;">
        <div
          style="display:flex; align-items:center; gap: 0.5rem;"
          v-for="tag of filteredTags"
          :key="tag"
        >
          <button
            class="Chip"
            style="flex: 1;"
            @click="u.toggle(toRemove,tag)"
            :style="toRemove.includes(tag) ? 'opacity: 0.25;':''"
          >
            <span>{{ toRename[tag] ? "* " + toRename[tag]  : tag}}</span>
            <small>({{ count[tag] }})</small>
            <i></i>
          </button>
          <button
            v-if="toRename[tag]"
            class="iconButton"
            @click="renameReset(tag)"
          >
            <i></i>
          </button>
          <button v-else class="iconButton" @click="renameStart(tag)">
            <i></i>
          </button>
        </div>
      </div>
      <div v-else style="text-align:center; color: var(--white4)">No tags found
      </div>

      <template slot="actions">
        <button @click="modal.hide()" class="Button Button-text">Cancel</button>
        <button @click="save" class="Button">Save</button>
      </template>
    </Modal>

    <Modal ref="modalRename" title="Rename" :title-suffix="oldName" centered>
      <TextField>
        <input
          v-model="newName"
          v-space-to-underscore
          @keydown.enter="renameFinish"
          type="text" aria-label="rename"
        >
      </TextField>

      <template slot="actions">
        <button @click="modalRename.hide()" class="Button Button-text">Cancel
        </button>
        <button @click="renameFinish" class="Button">Rename</button>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from "vue-property-decorator"
  import Modal from "@/components/Modal.vue"
  import TextField from "@/components/TextField.vue"
  import ImgSet from "@/components/ImgSet.vue"
  import Store from "@/services/Store"
  import * as u from "@/utils/utilFunctions"
  import Toast from "@/components/Toast.vue"

  @Component({
    components: {ImgSet, TextField, Modal},
  })
  export default class ModalManageTags extends Vue {
    static self: ModalManageTags
    @Ref() readonly modal!: Modal
    @Ref() readonly modalRename!: Modal
    u = u
    filterInput = ""
    tags: string[] = []
    count = {}
    toRemove: string[] = []
    toRename = {}
    oldName = ""
    newName = ""

    get filteredTags(): string[] {
      return this.tags.filter(x => x.startsWith(this.filterInput))
    }

    show() {
      this.tags = []
      this.count = {}
      this.toRemove = []
      this.toRename = {}
      Store.tags.forEach(tag => {
        this.tags.push(tag)
        this.count[tag] = Store.items.filter(x => x.tags.includes(tag)).length
      })
      this.tags.sort((a, b) => {
        if (this.count[a] > this.count[b]) return -1
        if (this.count[a] < this.count[b]) return 1
        return a.localeCompare(b, "en")
      })
      this.modal.show()
    }

    async save() {
      if (this.toRemove.length) await Store.destroyTags(this.toRemove)
      const renameMap: [string, string][] = Object.entries(this.toRename)
      if (renameMap.length) await Store.renameTags(renameMap)
      this.modal.hide()
      if (this.toRemove.length || renameMap.length)
        Toast.self.show("Tags updated")
    }

    renameStart(tag: string) {
      this.oldName = tag
      this.newName = tag
      this.modalRename.show()
    }

    renameFinish() {
      if (this.newName && this.newName !== this.oldName)
        Vue.set(this.toRename, this.oldName, this.newName)
      this.modalRename.hide()
    }

    renameReset(tag) {
      Vue.delete(this.toRename, tag)
    }

    created() {
      ModalManageTags.self = this
    }
  }
  if (module.hot) module.hot.decline()
</script>

<style scoped>
  .iconButton {
    width: 2rem;
    height: 2rem;
    text-align: center;
    color: var(--white3);
  }
  .iconButton:hover {
    color: var(--white5);
  }
</style>
