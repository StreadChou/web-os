import type {App, Plugin} from 'vue'; // 导入 Vue 的 App 和 Plugin 类型
import WebOs from "./components/WebOs.vue";
import './style/global.css'
import {useAppManager} from "./store/AppManager.ts";
import type {AppConfigInterface} from "./app/AppInterface.ts";
import {createPinia} from 'pinia';
import type {WebOSPluginOptions} from "./define/WebOSPlugin.ts";
import {WindowInstance} from "./window/WindowInstance.ts";

// 定义 WebOSPlugin
const WebOSPlugin: Plugin<WebOSPluginOptions> = {
    /**
     * Vue 插件的安装方法。
     * 当消费者调用 `app.use(WebOSPlugin, options)` 时，此方法会被执行。
     * @param app Vue 应用实例
     * @param options
     */
    install(app: App, options: WebOSPluginOptions) {
        app.use(createPinia());

        // 1. 注册全局组件
        // 这使得 WebOSButton 组件可以在任何地方直接使用，无需单独导入
        app.component('web-os', WebOs); // 更改此处

        // 2. 添加全局属性
        // 通过 `app.config.globalProperties` 添加的属性可以在 Options API 中通过 `this.$webos` 访问，
        // 或在 Composition API 中通过 `getCurrentInstance()?.appContext.config.globalProperties.$webos` 访问。
        app.config.globalProperties.$webos = {};

        // 3. 提供可在子组件中注入的依赖 (Composition API 推荐方式)
        // 消费者可以在组件中通过 `inject('webos-core')` 获取这些值
        app.provide('webos-core', {
            // 也可以提供 Pinia store 实例或相关操作
            useAppManager: useAppManager, // 提供获取 store 的方法
        });

        // 4. 根据插件选项进行初始化设置
        if (options) {
            const appManager = useAppManager();
            appManager.options = options;
        }


        console.log('WebOSPlugin 安装完成。');
    },
};


export {WebOs, useAppManager, WindowInstance};
export type {AppConfigInterface, WebOSPluginOptions};
export default WebOSPlugin;