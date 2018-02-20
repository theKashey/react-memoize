declare module 'react-memoize' {
    import * as React from 'react';

    interface AnyProp {
        [key: string]: any;
    }

    interface MemoizeProps {
        compute: (props: any) => any;
        children: (props: any) => React.ReactNode;
    }

    /**
     * Memoizes the `compute` function, and provide a result as a render prop
     */
    export default class ReactMemoize extends React.Component<MemoizeProps & AnyProp, {}> {}
}