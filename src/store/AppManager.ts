import {defineStore} from 'pinia';
import type {AppConfigInterface} from "../app/AppInterface.ts";
import {WindowInstance} from "../window/WindowInstance.ts";
import type {WebOSPluginOptions} from "../define/WebOSPlugin.ts";

export interface DomRef {
    windowLayoutRef?: HTMLDivElement,
    appArea?: HTMLDivElement,
}

export const useAppManager = defineStore('_wo_app_manager', {
    state: () => ({
        count: 0,

        options: {} as WebOSPluginOptions,
        // 所有的软件
        apps: [] as AppConfigInterface[],
        // 所有正在运行的软件
        windows: {} as { [key in number]: WindowInstance },
        // 所有dom链接的ref
        domRef: {} as DomRef,

        /** 打开应用时候的默认X位置 */
        defaultX: 50,
        /** 打开应用时候的默认Y位置 */
        defaultY: 50,
    }),
    actions: {
        injectApp(app: AppConfigInterface) {
            this.apps.push(app);
        },

        showOrCreateWindow(app: AppConfigInterface) {
            const has = Object.values(this.windows).find(ele => ele.app.package == app.package);
            if (has) return has.active();
            this.createWindow(app);
        },

        createWindow(app?: AppConfigInterface) {
            if (!app) return null;
            // 每次打开应用的时候, 偏移一下, 避免覆盖, 不知道自己打开了
            let x = this.defaultX + (this.count * 5);
            let y = this.defaultY + (this.count * 5);
            let width = app.defaultWidth || 200;
            let height = app.defaultHeight || 100;

            this.count += 1;
            if (app.defaultMax) {
                x = 0;
                y = 0;
                width = 76800;
                height = 43200;
            }
            const window = new WindowInstance(this.count, app, x, y, width, height);
            this.windows[window.id] = window;
            // 设置活跃
            window.active();

            return window;
        },

        closeWindow(id: number) {
            delete this.windows[id]
        },

        selectWindows(id: number) {
            for (const i in this.windows) {
                const item = this.windows[i];
                item.zIndex = item.id == id ? 101 : 100;
            }
        }
    },
});