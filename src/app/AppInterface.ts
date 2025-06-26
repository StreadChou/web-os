export interface AppConfigInterface {
    /** App名字 */
    name: string;
    /** App图标 */
    icon: string;
    /** 是否隐藏 */
    hidden?: () => boolean;

    /** 默认宽度, 不给则是800 */
    defaultWidth?: number;
    /** 默认高度, 不给则是400 */
    defaultHeight?: number;
}