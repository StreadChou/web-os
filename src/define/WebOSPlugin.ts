export interface WebOSPluginOptions {
    /** 壁纸 */
    wallpaper?: string;
    /** 默认的窗口头 */
    windowBar?: any;

    /** LeftPanel, 全局左侧导航 */
    leftPanel?: any;

    [key: string]: any; // 如果你允许任意额外的属性，可以加上索引签名
}