import {defineStore} from 'pinia';
import type {AppConfigInterface} from "../app/AppInterface.ts";
import {WindowInstance} from "../window/WindowInstance.ts";
import type {WebOSPluginOptions} from "../define/WebOSPlugin.ts";

export const useAppManager = defineStore('_wo_app_manager', {
    state: () => ({
        count: 0,

        options: {} as WebOSPluginOptions,
        apps: [] as AppConfigInterface[],
        windows: {} as { [key in number]: WindowInstance },

        /** 打开应用时候的默认X位置 */
        defaultX: 50,
        /** 打开应用时候的默认Y位置 */
        defaultY: 50,
    }),
    actions: {
        injectApp(app: AppConfigInterface) {
            this.apps.push(app);
        },
        createWindow(app: AppConfigInterface) {
            // 每次打开应用的时候, 偏移一下, 避免覆盖, 不知道自己打开了
            const x = this.defaultX + (this.count * 5);
            const y = this.defaultY + (this.count * 5);

            const width = app.defaultWidth || 800;
            const height = app.defaultHeight || 400;

            this.count += 1;
            const window = new WindowInstance(this.count, app, x, y, width, height);
            this.windows[window.id] = window;
            return window;
        },

        closeWindow(id: number) {
            delete this.windows[id]
        },

        toggleMaximize(id: number, x?: number, y?: number) {
            const item: WindowInstance = this.windows[id];
            if (!item) return null;
            if (item.isMaximized) {
                // 从最大化状态恢复
                item.x = x ?? item.originalX ?? 0;
                item.y = y ?? item.originalY ?? 0;
                item.width = item.originalWidth || 400;
                item.height = item.originalHeight || 300;
            } else {
                // 记录当前尺寸和位置，然后最大化
                item.originalX = item.x as number;
                item.originalY = item.y as number;
                item.originalWidth = item.width as number;
                item.originalHeight = item.height as number;

                item.x = 0;
                item.y = 0;
                item.width = "100vw";
                item.height = "100vh";
            }
            item.isMaximized = !item.isMaximized;
            this.selectWindows(id); // 最大化/恢复时置顶
        },

        toggleMinimize(id: number) {
            const item = this.windows[id];
            if (!item) return null;
            item.isMinimized = !item.isMinimized;
            // 如果窗口从最小化状态恢复，则将其置顶
            if (!item.isMinimized) {
                this.selectWindows(id);
            }
        },

        selectWindows(id: number) {
            for (const i in this.windows) {
                const item = this.windows[i];
                item.zIndex = item.id == id ? 101 : 100;
            }
        }
    },
});