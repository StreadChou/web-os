import {useAppManager} from "../../store/AppManager.ts";
import {AppHelper} from "../Apps/AppHelper.ts";
import {DomRefManger} from "../DomRef/DomRefManger.ts";
import {RunningAppManager} from "./RunningAppManager.ts";

export class RunningApp {
    /** 运行ID */
    pid: number;
    /** 唯一的包名 */
    packageId: string;

    /** 主窗口的dom */
    mainWindowDom?: HTMLElement;
    /** Docker上的图标的dom */
    dockerIconDom?: HTMLElement;

    /** 是否最小化 */
    isMinimized: boolean = false;

    constructor(pid: number, packageId: string) {
        this.pid = pid;
        this.packageId = packageId;
    }

    get appConfig() {
        return AppHelper.getAppConfig(this.packageId)
    }


    active() {
        const appManager = useAppManager();
        appManager.selectWindows(this.pid);
    }

    get isActive() {
        const store = this.getStore();
        return store.zIndex == 101
    }

    get isMaximized() {
        const store = this.getStore();
        return DomRefManger.windowMaxHeight == store.windowStyle.height
            && DomRefManger.windowMaxWidth == store.windowStyle.width
            && store.windowStyle.top == 0
            && store.windowStyle.left == 0;
    }


    resize(width: number, height: number, top: number, left: number) {
        if (this.mainWindowDom) this.mainWindowDom.style.transition = 'none'
        const store = this.getStore();
        store.windowStyle.height = height;
        store.windowStyle.width = width;
        store.windowStyle.top = top;
        store.windowStyle.left = left;
    }


    toggleMinimize() {
        if (this.isMinimized) {
            // 还原窗口
            requestAnimationFrame(() => {
                if (!this.mainWindowDom) return null;

                this.mainWindowDom.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                this.mainWindowDom.style.transform = 'scale(1) translate(0,0)';
                this.mainWindowDom.style.opacity = '1';
                this.mainWindowDom.style.pointerEvents = 'auto';
            });

            this.isMinimized = false;
        } else {
            if (!this.mainWindowDom) return null;
            if (!this.dockerIconDom) return null;
            // 缩放到 docker icon
            const rect = this.mainWindowDom.getBoundingClientRect();
            const targetRect = this.dockerIconDom.getBoundingClientRect();

            const scaleX = targetRect.width / rect.width;
            const scaleY = targetRect.height / rect.height;
            const translateX = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2);
            const translateY = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2);

            this.mainWindowDom.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            this.mainWindowDom.style.transformOrigin = 'center center';
            this.mainWindowDom.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
            this.mainWindowDom.style.opacity = '0';
            this.mainWindowDom.style.pointerEvents = 'none'; // 最小化后不可操作

            const onTransitionEnd = () => {
                if (!this.mainWindowDom) return null;
                this.mainWindowDom.removeEventListener('transitionend', onTransitionEnd);
            };
            this.mainWindowDom.addEventListener('transitionend', onTransitionEnd);

            this.isMinimized = true;
        }
    }


    toggleMaximize() {
        // 设置动画
        if (this.mainWindowDom) this.mainWindowDom.style.transition = 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease';
        const store = this.getStore();
        if (this.isMaximized) {
            // 处理最大化之后恢复
            if (store.lastWindowStyle) store.windowStyle = {...store.lastWindowStyle};
            else store.windowStyle = {width: 800, height: 600, top: 0, left: 0,};
        } else {
            // 处理最大化
            store.lastWindowStyle = {...store.windowStyle}
            store.windowStyle = {
                width: DomRefManger.windowMaxWidth,
                height: DomRefManger.windowMaxHeight,
                top: 0,
                left: 0,
            };
        }
        this.active();
    }

    close() {
        RunningAppManager.Instance.closeAppInstance(this.pid)
    }

    move(top: number, left: number) {
        if (this.mainWindowDom) this.mainWindowDom.style.transition = 'none'
        const store = this.getStore();
        store.windowStyle.top = top;
        store.windowStyle.left = left;
    }


    clickDockerIcon() {
        // 最小化的应用直接打开
        if (this.isMinimized) return this.toggleMinimize();
        // 普通应用让其活跃
        this.active()
    }

    toDefaultStore(): RunningAppInStore {
        const appConfig = this.appConfig;
        const windowStyle: WindowStyle = {
            /** 距离顶部位置: 单位PX */
            top: 50 + (this.pid * 10),
            /** 距离左侧位置: 单位PX */
            left: 50 + (this.pid * 10),
            /** 宽: 单位PX */
            width: 800,
            /** 高: 单位PX */
            height: 400,
        };
        return {
            pid: this.pid,
            packageId: this.packageId,
            title: appConfig.name,
            icon: appConfig.icon,
            windowStyle: windowStyle,
            zIndex: 101,
        }
    }

    getStore() {
        const appManager = useAppManager();
        let rlt = appManager.runningApps[this.pid]
        if (!rlt) throw new Error(`App in Store is not running or closed, pid:${this.pid}`)
        return rlt;
    }
}


export interface RunningAppInStore {
    /** 唯一ID */
    pid: number;
    /** 唯一的包名 */
    packageId: string;
    /** 窗口标题 */
    title: string;
    /** 图标 */
    icon: string;
    /** 窗口样式 */
    windowStyle: WindowStyle
    /** 记录的窗口样式: 用于还原窗口信息 */
    lastWindowStyle?: WindowStyle
    /** 层级 */
    zIndex: number
}

export interface WindowStyle {
    /** 距离顶部位置: 单位PX */
    top: number;
    /** 距离左侧位置: 单位PX */
    left: number;
    /** 宽: 单位PX */
    width: number;
    /** 高: 单位PX */
    height: number;
}