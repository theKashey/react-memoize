import * as React from 'react'
import Memoize, {MemoizedFlow, MemoizeContext, default as ReactMemoize, RenderFn, ConsumerProps} from 'react-memoize';

const Y = () => (
    <Memoize
        prop1={0}
        prop2={4}
        prop3="string"
        compute={({prop1, prop2}) => prop1+prop2}
    >{
        (a:number) => <div>{a * 2}</div>
    }</Memoize>
)

const Flow = () => (
    <MemoizedFlow
       input={{x:1, y:2, left:3}}
       flow={[
           ({x,y}) => ({x,y}),
           ({y}) => ({y})
       ]}
    >
        { output => output.x+output.y+output.left}
    </MemoizedFlow>
);


const Consumer:React.ComponentClass<ConsumerProps<{x:number, y:string}>> = null as any;

const BadConsumer:React.SFC<{children: string}> = () => <div></div>;

const Context = () => (
    <MemoizeContext
        consumer={Consumer}
        selector={ p => p.x }
    >
        { x => x.x}
    </MemoizeContext>
)
