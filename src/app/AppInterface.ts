export interface AppConfigInterface {
    /** App名字 */
    name: string;
    /** App图标 */
    icon: string;
    /** 渲染组件 */
    view?: any;
    /** 标题栏 */
    header?: any;
    /** 是否全量隐藏 */
    hidden?: () => boolean;
    /** 是否在桌面隐藏 */
    hiddenInDesktop?: () => boolean;
    /** 是否在启动器隐藏 */
    hiddenInLauncher?: () => boolean;

    /** 默认宽度, 不给则是800 */
    defaultWidth?: number;
    /** 默认高度, 不给则是400 */
    defaultHeight?: number;
    /** 不需要外边框 */
    noBoard?: boolean;

    /** 传参 */
    props?: Record<string, any>;

    /** 关闭调用 */
    onClose?: () => void;
}