import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
	faCircleCheck,
	faCircleInfo,
	faCircleNotch,
	faCircleXmark,
	faSpinner,
	faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import App from "./App.vue";
import "./styles.css";

library.add(
	faSpinner,
	faCircleNotch,
	faCircleCheck,
	faTriangleExclamation,
	faCircleXmark,
	faCircleInfo,
);

const app = createApp(App);
app.use(createPinia());
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
