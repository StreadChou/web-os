import {defineStore} from 'pinia';
import type {WebOSPluginOptions} from "../define/WebOSPlugin.ts";
import type {AppInterfaceInStore} from "../app/Apps/AppInterface.ts";
import {AppHelper} from "../app/Apps/AppHelper.ts";
import {type RunningAppInStore} from "../app/RunningApp/RunningApp.ts";
import {RunningAppManager} from "../app/RunningApp/RunningAppManager.ts";

export const useAppManager = defineStore('_wo_app_manager', {
    state: () => ({
        // 所有的已经注册的软件 - 用于渲染桌面上的图标
        apps: {} as Record<string, AppInterfaceInStore>,
        // 运行的app的pid的自增
        pidUnique: 0,
        // 运行中的App
        runningApps: {} as Record<number, RunningAppInStore>,

        options: {} as WebOSPluginOptions,
    }),
    actions: {
        // 展示App或者创建一个新的
        showOrCreateWindow(app: AppInterfaceInStore) {
            const config = AppHelper.getAppConfig(app.packageId);
            const allRunning = Object.values(this.runningApps).filter(ele => ele.packageId == config.packageId);
            if (!allRunning || allRunning.length <= 0) return this.createWindow(app);

            // 每次点击就会切换到下一个窗口的逻辑
            const instances = allRunning.map(ele => RunningAppManager.Instance.getAppInstance(ele.pid));
            let index = instances.findIndex(ele => ele.isActive);
            const target = index + 1 > instances.length - 1 ? index = 0 : index += 1;
            instances[target].active();
        },

        // 创建一个新的窗口
        createWindow(app?: AppInterfaceInStore) {
            if (!app) return null;
            // 获取完整配置
            const config = AppHelper.getAppConfig(app.packageId);
            this.pidUnique += 1;
            const appInstance = RunningAppManager.Instance.createAppInstance(this.pidUnique, config.packageId);
            this.runningApps[appInstance.pid] = appInstance.toDefaultStore();
        },

        closeWindow(id: number) {
            delete this.runningApps[id]
        },

        selectWindows(pid: number) {
            for (const i in this.runningApps) {
                const item = this.runningApps[i];
                item.zIndex = item.pid == pid ? 101 : 100;
            }
        }
    },
});