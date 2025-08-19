import type {AppInterface, AppInterfaceInStore} from "./AppInterface.ts";
import {useAppManager} from "../../store/AppManager.ts";

export class AppHelper {
    static apps: Record<string, AppInterface> = {};

    /** 注册App */
    static registerApp(app: AppInterface) {
        this.apps[app.packageId] = app;
        const appManager = useAppManager();
        appManager.apps[app.packageId] = this._appInterfaceToStore(app);
    }

    /** 获取App的配置 */
    static getAppConfig(packageId: string): AppInterface {
        const app = this.apps[packageId]
        if (!app) throw new Error(`none package id register, packageId: ${packageId}`);
        return app;
    }

    /** 将App的配置转换成pinia存储的数据 */
    private static _appInterfaceToStore(app: AppInterface): AppInterfaceInStore {
        return {
            packageId: app.packageId,
            name: app.name,
            icon: app.icon
        }
    }

}