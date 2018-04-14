declare module 'react-memoize' {
    import * as React from 'react';

    export type PropOf<T extends { [key: string]: any }> = {
        [K in keyof T]: T[K];
    };

    export type NotRequired<T extends { [key: string]: any }> = {
        [K in keyof T]?: T[K];
    };

    export type RenderFn<T> = (value: T) => React.ReactNode;
    export type ConsumerProps<T> = { children: RenderFn<T> | [RenderFn<T>] };

    type ItoI<T, K = NotRequired<T> > = (input: T) => K;
    interface Nothing {}

    type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];
    export type Minus<T, U> = {[P in Diff<keyof T, keyof U>]: T[P]};

    export interface MemoizeProps<T, K> {
        compute: (props: Minus<K,MemoizePropsMinus>) => T;
        children: RenderFn<T>;
        pure?: boolean
    }

    export interface MemoizePropsMinus {
        compute: any;
        children: any;
        pure: any
    }

    export interface ContextProps<T, R> {
        selector: (props: NotRequired<T> ) => R;
        children: RenderFn<any>
        consumer: React.ComponentClass<ConsumerProps<T>>;
    }

    export interface FlowProps<T> {
        input: T,
        flow: ItoI<T>[],
        children: RenderFn<T>;
    }

    /**
     * Memoizes the `compute` function, and provide a result as a render prop
     */
    export default class ReactMemoize<T, B, K = PropOf<B>> extends React.Component<MemoizeProps<T, K> & B> {
    }

    export class MemoizeContext<T, R> extends React.Component<ContextProps<T, R>, {}> {
    }

    export class MemoizedFlow<T> extends React.Component<FlowProps<T>, {}> {
    }
}