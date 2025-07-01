import type {AppConfigInterface} from "../app/AppInterface.ts";
import {useAppManager} from "../store/AppManager.ts";

export class WindowInstance {
    id: number;
    app: AppConfigInterface
    title: string;

    x: number | string;
    y: number | string;
    width: number | string;
    height: number | string;

    isMaximized: boolean = false;
    isMinimized: boolean = false;
    zIndex: number = 101;
    // 存储原始尺寸，用于最大化/恢复
    originalX?: number;
    originalY?: number;
    originalWidth?: number;
    originalHeight?: number;

    childWindows: WindowInstance[] = [];


    constructor(id: number, app: AppConfigInterface, x: number, y: number, width: number, height: number) {
        this.id = id;
        this.app = app;
        this.title = app.name;

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    active() {
        const AppManager = useAppManager();
        AppManager.selectWindows(this.id);
    }

    toggleMinimize() {
        const AppManager = useAppManager();
        AppManager.toggleMinimize(this.id);
    }


    toggleMaximize() {
        const AppManager = useAppManager();
        AppManager.toggleMaximize(this.id);
    }

    close() {
        const AppManager = useAppManager();
        AppManager.closeWindow(this.id);
        if (this.app.onClose) this.app.onClose();
        this.childWindows.forEach(ele => ele.close());
    }

    /** 创建子Windows,一旦关闭主window, 子window会被一起关闭. */
    createChildWindow(app: AppConfigInterface) {
        const AppManager = useAppManager();
        const window = AppManager.createWindow(app);
        this.childWindows.push(window);
    }

}