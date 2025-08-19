import {RunningApp} from "./RunningApp.ts";
import {useAppManager} from "../../store/AppManager.ts";

export class RunningAppManager {


    apps: Map<number, RunningApp> = new Map();


    createAppInstance(pid: number, packageId: string) {
        if (this.apps.has(pid)) throw new Error(`App is already running, pid:${pid}`)
        this.apps.set(pid, new RunningApp(pid, packageId));
        return this.getAppInstance(pid);
    }

    getAppInstance(pid: number) {
        const app = this.apps.get(pid);
        if (!app) throw new Error(`App is not running or closed, pid:${pid}`)
        return app;
    }

    closeAppInstance(pid: number) {
        this.apps.delete(pid);
        const AppManager = useAppManager();
        AppManager.closeWindow(pid);
    }

    static _instance: RunningAppManager;

    private constructor() {
        // 禁止实例化
    }

    static get Instance(): RunningAppManager {
        if (!this._instance) this._instance = new RunningAppManager();
        return this._instance;
    }
}