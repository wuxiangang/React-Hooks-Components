import { ReactElement } from 'react'

type Item =  Partial<{
    readonly url: string;
    node: ReactElement;
}> | string;

type UnKnownOptFn<T> = (opt: T) => unknown;

export interface ScrollerOpt {
    items: Item[];
    animation?: number;
    showBtn?: boolean;
    overlayClassName?: string;
}

export type ScrollerHookReturnValue = {
    index: number;
    nextTurn: boolean;
    scrollInit: UnKnownOptFn<AllowNullType<number>>;
    scrollClick: UnKnownOptFn<number>;
}

export type ScrollerHookOpt = {
    max: number;
    time?: number;
    elem: HTMLElement;
}

export type AllowNullType<T> = T | null