import Vue from "vue"
import vClickAway from "vue-clickaway"
import * as u from "@/utils/utilFunctions"

Vue.directive("click-away", vClickAway.directive)

// automatically convert spaces to underscores while typing in an input
Vue.directive("spaceToUnderscore", {
  inserted(el) {
    const input: HTMLInputElement = <HTMLInputElement>el
    input.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key !== " ") return
      e.preventDefault()
      const cursor: number = <number>input.selectionStart
      input.value = u.insert(input.value, cursor, "_")
      input.dispatchEvent((new Event("input"))) // trigger v-model sync
      input.setSelectionRange(cursor + 1, cursor + 1)
    })
  },
})
