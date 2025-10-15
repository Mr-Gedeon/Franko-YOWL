import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(VueSweetalert2);

app.use(pinia);
app.use(router);
app.mount("#app");
