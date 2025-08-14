import type {AppConfigInterface} from "../app/AppInterface.ts";
import {useAppManager} from "../store/AppManager.ts";

export class WindowInstance {
    /** 窗口的唯一ID */
    id: number;
    /** 软件配置 */
    app: AppConfigInterface
    /** window的Dom: 在window初始化的时候填入的 */
    windowRef?: HTMLDivElement;

    /** 窗口标题 */
    title: string;

    /** 窗口样式 */
    windowStyle: WindowStyle
    /** 记录的窗口样式: 用于还原窗口信息 */
    lastWindowStyle?: WindowStyle
    /** 是否最小化 */
    isMinimized: boolean = false;

    /** 层级 */
    zIndex: number = 101;


    /** 附件的所有样式 */
    classList: string[] = [];
    /** 子窗口 */
    childWindows: Array<WindowInstance> = [];


    constructor(id: number, app: AppConfigInterface, top: number, left: number, width: number, height: number) {
        this.id = id;
        this.app = app;
        this.title = app.name;
        width = Math.min(width, this.maxWidth);
        height = Math.min(height, this.maxHeight);
        if (width >= this.maxWidth) left = 0;
        if (height >= this.maxHeight) top = 0;
        this.windowStyle = {top, left, width, height}
        // 如果一打开就是最大化的, 初始化一个小窗
        if (this.isMaximized) {
            this.lastWindowStyle = {top, left, width: width / 2, height: height / 2}
        }
    }

    /** 最大宽度: 不能超过父元素的宽度 */
    get maxWidth() {
        const AppManager = useAppManager();
        const layoutRef = AppManager.domRef.windowLayoutRef
        if (!layoutRef) return 1920;
        return layoutRef.offsetWidth;
    }

    /** 最大高度: 不能超过父元素的高度 */
    get maxHeight() {
        const AppManager = useAppManager();
        const layoutRef = AppManager.domRef.windowLayoutRef
        if (!layoutRef) return 1080;
        return layoutRef.offsetHeight;
    }

    /** 是否最大化 */
    get isMaximized() {
        return this.maxHeight == this.windowStyle.height
            && this.maxWidth == this.windowStyle.width
            && this.windowStyle.top == 0
            && this.windowStyle.left == 0;
    }

    get isActive() {
        return this.zIndex === 101;
    }

    /** 记录窗口样式 */
    recordWindowsStyle() {
        this.lastWindowStyle = {...this.windowStyle}
    }

    active() {
        const AppManager = useAppManager();
        AppManager.selectWindows(this.id);
    }


    toggleMinimize() {
        if (!this.windowRef) return;
        const dockerIconDom = this.getDockerIconDom();
        if (!dockerIconDom) return;

        const windowEl = this.windowRef;

        if (this.isMinimized) {
            // 还原窗口
            requestAnimationFrame(() => {
                windowEl.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                windowEl.style.transform = 'scale(1) translate(0,0)';
                windowEl.style.opacity = '1';
                windowEl.style.pointerEvents = 'auto';
            });

            this.isMinimized = false;
        } else {
            // 缩放到 docker icon
            const rect = windowEl.getBoundingClientRect();
            const targetRect = dockerIconDom.getBoundingClientRect();

            const scaleX = targetRect.width / rect.width;
            const scaleY = targetRect.height / rect.height;
            const translateX = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2);
            const translateY = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2);

            windowEl.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            windowEl.style.transformOrigin = 'center center';
            windowEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
            windowEl.style.opacity = '0';
            windowEl.style.pointerEvents = 'none'; // 最小化后不可操作

            const onTransitionEnd = () => {
                windowEl.removeEventListener('transitionend', onTransitionEnd);
            };
            windowEl.addEventListener('transitionend', onTransitionEnd);

            this.isMinimized = true;
        }
    }


    getDockerIconDom() {
        const AppManager = useAppManager();
        const appArea = AppManager.domRef.appArea;
        if (!appArea) return null;
        return appArea.querySelector(`.app[data-id="${this.id}"]`) as HTMLDivElement | null;

    }


    toggleMaximize() {
        // 设置动画
        if (this.windowRef) this.windowRef.style.transition = 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease';

        if (this.isMaximized) {
            // 处理最大化之后恢复
            if (this.lastWindowStyle) this.windowStyle = {...this.lastWindowStyle};
            else this.windowStyle = {width: 800, height: 600, top: 0, left: 0,};
        } else {
            // 处理最大化
            this.recordWindowsStyle()
            this.windowStyle = {width: this.maxWidth, height: this.maxHeight, top: 0, left: 0,};
        }

        const AppManager = useAppManager();
        AppManager.selectWindows(this.id);
    }

    resize(width: number, height: number, top: number, left: number) {
        if (this.windowRef) this.windowRef.style.transition = 'none'
        this.windowStyle.height = height;
        this.windowStyle.width = width;
        this.windowStyle.top = top;
        this.windowStyle.left = left;
    }

    move(top: number, left: number) {
        if (this.windowRef) this.windowRef.style.transition = 'none'
        this.windowStyle.top = top;
        this.windowStyle.left = left;
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
        if (window) this.childWindows.push(window);
    }

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