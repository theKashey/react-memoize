import * as React from 'react'
import Memoize from 'react-memoize';

const Y = () => (
    <Memoize
        prop1={0}
        prop2={4}
        compute={({prop1, prop2}) => prop1}
    >{
        (a: number) => a * 2
    }</Memoize>
)