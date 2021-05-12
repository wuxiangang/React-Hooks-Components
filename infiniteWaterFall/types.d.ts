import { ReactElement, MouseEvent, MouseEventHandler } from 'react'

type ImpNumber = string | number;

type Anyer = Partial<{
    [key: string]: any;
}>

type DOMBox = Partial<{
     // 图片初始宽高
     width: ImpNumber;
     height: ImpNumber;
     // 样式名
     className: string;
}>

type Imager = {
     // 缩略图地址
     readonly thumb_url: string;
     // 图片地址
     readonly url: string;
}

// 无限滚动参数
type ReactRender = () => ReactElement

type InfiniteItem =  Partial<{
    // 无限加载接口
    fetch: () => unknown;
    // 无限加载底部展示自定义loading效果
    loadNode: ReactRender;
    // 底部预加载高度
    fetchBottom: number;
    // 判断是否结束
    noMore: boolean;
}>

// 对应单个元素属性
type DataItemFn<T> = (data: DataItemOpt | {data: DataItemOpt}) => T;
type EventFn = (e: MouseEvent) => unknown
type ItemOptions = Partial<{
    // 设置元素之间间隔
    gap: number;
    // 设置一行元素数量
    columns: number;
    // 元素内部添加子元素
    render: DataItemFn<ReactElement>;
    // 元素点击事件回调
    onClick: DataItemFn<unknown>;
    // 选中主key 默认id
    selectorKey: string;
    // 选中时元素样式
    selectedClassName: string;
    // 选中触发时间
    onSelect: SelectionFn;
    // 进入/离开时候触发事件
    onEnter: EventFn;
    onLeave: EventFn;
}>

// 选中参数
type SelectionFn = (id: ImpNumber, selectors: ImpNumber[], data: DataItemOpt) => unknown;

type TAnyer<T> = T & Anyer
// 瀑布流方法
type WaterFallerOpt = Partial<{
    w: number;
    cache: any[];
    scroller: ReactElement | null;
}> & ItemOptions & Anyer

// 组件所有参数
export type WaterFallOptions = {
    // 列表数据
    dataSource: DataItemOpt[];
    // 元素属性
    itemOpt?: ItemOptions;
    // 选择器
    selectors?: ImpNumber[],
    // 无限滚动参数
    infinite?: InfiniteItem;
    // 虚拟
    virtual?: null;
    // 分片, 默认全部一次性加载
    fiber?: number;
    fiberDuration?: number;
    // scroll 回调
    onScrollHandle?: (e: MouseEvent, data: DataItemOpt[]) => void;
    // 每次加载完成调用
    onMounted?: (data: DataItemOpt[]) => void;
    // 子元素在box最下方
    children?: ReactElement
} & TAnyer<DOMBox>

// 单个数据参数
export type DataItemOpt = Imager & TAnyer<DOMBox>
export type ListItemOpt = {
    type: string;
    data: DataItemOpt;
    itemOpt?: ItemOptions;
    selectors?: ImpNumber[]
}

// 分批
type TFiberLoading<T, U> = (data: T, start?: U, per?: U, type?: string) => T extends Array<infer K> ? Promise<K[]> : T
export type TFiberLoadingFn = TFiberLoading<DataItemOpt[], number>