import "@/css/reset.css"
import "@/css/base.css"
import "@/components/Button.css"
import "@/components/Chip.css"

import Vue from "vue"
import "vue-class-component/hooks"
import "reflect-metadata"
import "@/utils/directives"
import App from "./App.vue"
import Store from "@/services/Store"
import Filter from "@/services/Filter"

Vue.config.productionTip = false
new Vue({
  data: {Store, Filter},
  render: h => h(App),
}).$mount("#app")

if (localStorage.getItem("lastDir"))
  Store.load(localStorage.getItem("lastDir")).catch()


