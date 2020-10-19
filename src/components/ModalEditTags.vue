<template>
  <Modal
    ref="modal"
    title="Edit tags"
    :title-suffix="`${items.length} ${items.length > 1 ? 'files' : 'file'}`"
  >
    <template slot="lead">
      <ImgSet
        :urlset="items.slice(0, 9).map(x => x.url)"
        style="margin-bottom: 1.5rem;"
      />
      <TextField>
        <i></i>
        <input
          ref="addTag"
          v-model="tagInput"
          v-space-to-underscore
          @keydown.enter="tagInput ? addTag(tagInput) : save()"
          @submit="addTag(tagInput)"
          @keydown.tab.prevent="hints.length ? addTag(hints[0]) : null"
          @keydown.down.prevent="$refs.hints.focus()"
          type="text"
          spellcheck="false"
          placeholder="Add tag..."
          aria-label="add tag"
        >
        <Hints
          ref="hints"
          :input="$refs.addTag"
          :hints="hints"
        />
      </TextField>
    </template>
    <div
      v-if="toAdd.length"
      style="display: grid; grid-gap: 1rem; margin-bottom: 1.5rem;"
    >
      <button class="Chip" v-for="tag of toAdd" @click="u.remove(toAdd,tag)">
        + {{ tag }} <i></i>
      </button>
    </div>
    <div v-if="tags.length" style="display: grid; grid-gap: 1rem;">
      <button
        class="Chip"
        v-for="tag of tags"
        @click="u.toggle(toRemove,tag)"
        :style="toRemove.includes(tag) ? 'opacity: 0.25;':''"
      >
        {{ tag }} <small v-if="count[tag] > 1">({{ count[tag] }})</small>
        <i></i>
      </button>
    </div>
    <div v-else style="color: var(--white4); text-align:center;">No tags set</div>
    <template slot="actions">
      <button @click="modal.hide()" class="Button Button-text">Cancel</button>
      <button @click="save" class="Button">Save</button>
    </template>
  </Modal>
</template>

<script lang="ts">
  import {Component, Prop, Ref, Vue} from "vue-property-decorator"
  import Modal from "@/components/Modal.vue"
  import TextField from "@/components/TextField.vue"
  import ImgSet from "@/components/ImgSet.vue"
  import Store from "@/services/Store"
  import * as u from "@/utils/utilFunctions"
  import Toast from "@/components/Toast.vue"
  import Hints from "@/components/Hints.vue"

  @Component({
    components: {Hints, ImgSet, TextField, Modal},
  })
  export default class ModalEditTags extends Vue {
    static self: ModalEditTags
    @Ref() readonly modal!: Modal
    u = u
    tagInput = ""
    items: Item[] = []
    tags: string[] = []
    count = {}
    toAdd: string[] = []
    toRemove: string[] = []

    get hints() {
      if (!this.tagInput) return []
      return Store.tags.filter(x => x.startsWith(this.tagInput))
    }

    show(items: Item[]) {
      this.items = items
      this.tags = []
      this.count = {}
      this.toAdd = []
      this.toRemove = []
      this.items.forEach(item => item.tags.forEach(tag => {
        u.addUnique(this.tags, tag)
        this.count[tag] = this.count[tag] ? this.count[tag] + 1 : 1
      }))
      this.tags.sort((a, b) => {
        if (this.count[a] > this.count[b]) return -1
        if (this.count[a] < this.count[b]) return 1
        return a.localeCompare(b, "en")
      })
      this.modal.show()
    }

    save() {
      if (this.toAdd.length) Store.addTags(this.items, this.toAdd)
      if (this.toRemove.length) Store.removeTags(this.items, this.toRemove)
      this.modal.hide()
      if (this.toAdd.length || this.toRemove.length)
        Toast.self.show("Tags updated")
    }

    addTag(tag) {
      this.toAdd.unshift(tag)
      this.tagInput = ""
    }

    created() {
      ModalEditTags.self = this
    }
  }
  if (module.hot) module.hot.decline()
</script>

<style scoped>
</style>
