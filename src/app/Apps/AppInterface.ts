export interface AppInterface extends AppViewInterface, AppShowableInterface, AppStyleInterface {
    /** 唯一的包名 */
    packageId: string;
    /** App名字 */
    name: string;
    /** App图标 */
    icon: string;

    /** 传参 */
    props?: Record<any, any>;
}


/** app渲染相关的内容 */
export interface AppViewInterface {
    /** 渲染组件 */
    view?: any;
    /** 标题栏 */
    header?: any;
}

/** app展示相关功能 */
export interface AppShowableInterface {
    /** 是否在桌面隐藏 */
    hiddenInDesktop?: (() => boolean) | boolean;
}

/** 样式相关内容 */
export interface AppStyleInterface {
    /** 默认宽度 */
    defaultWidth?: number | "half" | "max";
    /** 默认高度 */
    defaultHeight?: number | "half" | "max";
    /** 默认打开最大化 */
    defaultMax?: boolean;
}


/** app在store中保存的信息 */
export type AppInterfaceInStore = Pick<AppInterface, "packageId" | "name" | "icon">