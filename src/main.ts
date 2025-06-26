import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import "./style/global.css"
import {createPinia} from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); // 注册 Pinia
app.mount('#app');

