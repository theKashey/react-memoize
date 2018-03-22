# react-memoize
[![CircleCI status](https://img.shields.io/circleci/project/github/theKashey/react-memoize/master.svg?style=flat-square)](https://circleci.com/gh/theKashey/react-focus-lock/tree/master)

Component memoization for React! Based on [Dan Abramov's tweet](https://twitter.com/dan_abramov/status/965378278461755392) :)

[![NPM](https://nodei.co/npm/react-memoize.png?downloads=true&stars=true)](https://nodei.co/npm/react-memoize/)

```js
 import Memoize from 'react-memoize';
 
 <Memoize
   prop1 = "theKey"
   state = {this.state}
   
   compute={({prop1, state}) => heavyComputation(state[prop1])}
   pure
  >
  { result => <Display>{result}</Display>}
  </Memoize>
```

Memoize get `compute` function, add passes all the other props to it, streaming result to the render prop.

If `pure` prop is set ReactMemoize wil behave as PureComponent, and not update children when could not. 

### MemoizeContext
React memoize also provides component to __select__ and __memoize__ data from React16 context, or any other component 
which will pass some values into renderProp.

```js
import {MemoizeContext} from 'react-memoize';

<Context.Provider value={{prop1: 1, prop2: 2, prop3: 3}}>
    <MemoizeContext consumer={Context.Consumer} selector={select}>
      {values => <Render {...values} />}
    </MemoizeContext>
</Context.Provider>
``` 

This is like Redux without dispatching. State in context, selector aka mapStateToProps, and magic memoization in between.

## About

React-memoize uses [memoize-state](https://github.com/theKashey/memoize-state) underneath to perform __MobX__ like memozation
and achive the maximal minimal level of memoization cache misses.

For example:

- recomputation will be made only when stateSubKey is changed
```js
 <Memoize
   state = {this.state}   
   compute={({state}) => soSomethingWith(state.stateSubKey)}
  >
  { result => ....}
  </Memoize>
``` 
- recomputation will be made only when used prop is changed
```js
 <Memoize
   usedProp = {1}   
   unusedProp = {2}
   compute={({usedProp}) => soSomethingWith(usedProp)}
  >
  { result => ....}
  </Memoize>
``` 
- recomputation will be make only when item count changes, value of any item or text of items __passed__ thought the filter.
```js
 <Memoize
   list = {this.state.list}   
   compute={({list}) => list.filter(item => item.value).map(item => item.text)}
  >
  { result => ....}
  </Memoize>
``` 

The same magic as in [beautiful-react-redux](https://github.com/theKashey/beautiful-react-redux), kudos to `memoize-state` library.

PS: For systems without Proxy support memoize will use [memoize-one](https://github.com/alexreardon/memoize-one)


# Licence
 MIT
 
 
