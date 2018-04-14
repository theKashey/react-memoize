# react-memoize  🤯 🧠 🧙
[![CircleCI status](https://img.shields.io/circleci/project/github/theKashey/react-memoize/master.svg?style=flat-square)](https://circleci.com/gh/theKashey/react-focus-lock/tree/master)


Component memoization for React! Based on [Dan Abramov's tweet](https://twitter.com/dan_abramov/status/965378278461755392) :)
Could change the way you did `componentWillReceiveProps`, could replace `getDerivedStateFromProps`, could make things better.

> IE11+, React 15 and React 16.3 compatible.

[![NPM](https://nodei.co/npm/react-memoize.png?downloads=true&stars=true)](https://nodei.co/npm/react-memoize/)

### Memoize

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
There is only __one prop__ - `compute`, all others will be passed inside.
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
`consumer` could be any "context"-compatible Component - React.context, create-react-context or unstated.
All the additional props will be passed down to consumer. 

It is better to explain using example.
```js
<MemoizeContext consumer={Consumer} prop1={1} anotherProp={3} selector={select}> />

// will result

<Consumer prop1={1} anotherProp={3}>
{ contextValues => <ReactMemoize {...contextValues} compute={selector}>...</ReactMemoize>}
</Consumer>
```

This is like Redux without dispatching. State in context, selector aka mapStateToProps, and magic memoization in between.

__See it in action ->__ https://codesandbox.io/s/xjz5y3wzrz 🛠

## Flow
`getDerivedStateFromProps` gives you ability to from a new state from props, while `componentDidUpdate` enables you to react 
to the state changes.

__MemoizedFlow__ is `getDerivedStateFromState`. Following example react to the state changes, allowing 
to change ordering of rows and applies a pagination.

"The Flow" is safe and performant way to form something from something, and rebuilt then the time calls.
```js
import {MemoizedFlow} from 'react-memoize';

class SortablePageableTable extends Component {
    state = {
    page:0,
    perPage:10,
    filter: I => I
    };
    
    onSortChange = (order) => this.setState(order)
    onPageChange = page => this.setState(page);
    
    render () {
    return (
          <MemoizedFlow 
          input={{...this.props, ...this.state}}
          flow={[
            // will react on rows or filter change
            ({rows, filter}) => ({rows: list.filter(filter)}),
            // will react on rows(from step1) change or order
            ({rows, order}) => ({rows: list.slice().sort(order)}), // !! clone array before sort
            // will react on rows and pagination changes
            ({rows, page, perPage}) => ({rows: list.slice(page*perPage, (page+1)*perPage)}),
            // will react on something else, not related
            ({rain, bows}) => ({rainbows: rain+bows, rain: null, bows: null })
            ]}
          >
            {output => <Table {...output} onSortChange={this.onSortChange} onPageChange={this.onPageChange}/>}
          </MemoizedFlow>
    }
}

<SortablePageableTable rows = {tableRows} />
```
First step is getting `input`, and each following is reading from a value provided before, spreading
own result over it. Until the last step will be reached, and output will be provided to render prop.

Each step is memoized, as usual, and will always reuse value from the steps before. 


## About

React-memoize uses [memoize-state](https://github.com/theKashey/memoize-state) underneath to perform __MobX__ like memozation
and achive the maximal minimal level of memoization cache misses. Sounds a bit strange, but this mean - react-memoize will try to preserve the current `state` at all costs. From 10% to 50% "more" in comparison.

> In all the cases only ONE! result is memoized. The goal of the component is to cut off updates.

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
 
 
