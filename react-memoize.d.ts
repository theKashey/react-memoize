declare module 'react-memoize' {
    import * as React from 'react';

    interface MemoizeProps<T, K> extends T {
        compute: (props:T) => K;

        children: (props:K) => React.ReactNode
    }

    /**
     * Traps Focus inside a Lock
     */
    export default class ReactMemoize<T, K> extends React.Component<MemoizeProps<T, K>> {}
}