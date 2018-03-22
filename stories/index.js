import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';

import Memoize from '../src';


const heavyFunction = (list, count) => {
  for (let i = 0; i < 10000000; i++) {
    Math.random();
  }
  console.log('performed heavy computation')
  return {
    list: list.slice(0, count),
    time: Date.now()
  };
}

class Test1 extends Component {
  state = {
    count: 1,
    generation: 0,
    list: new Array(50).fill(1).map((x, index) => index)
  };

  componentDidMount() {
    setInterval(() => this.setState({generation: this.state.generation + 1}), 1000);
  }

  decC = () => this.setState(({count}) => ({count: count - 1}));
  incC = () => this.setState(({count}) => ({count: count + 1}));

  render() {
    return (
      <div>
        Valuable:
        <button onClick={this.decC}>-</button>{this.state.count}
        <button onClick={this.incC}>+</button>

        <Memoize
          list={this.state.list}
          count={this.state.count}
          generation={this.state.generation}

          compute={({list, count}) => heavyFunction(list, count)}
        >{
          ({list, time}) => (
            <div>
              render #{this.state.generation}, updated {Math.round((Date.now() - time) / 1000)} seconds ago
              <ul>
                {list.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
          )
        }
        </Memoize>

        <Memoize
          list={this.state.list}
          count={this.state.count}
          generation={this.state.generation}

          compute={({list, count}) => heavyFunction(list, count)}
          pure
        >{
          ({list, time}) => (
            <div>
              render #{this.state.generation}, updated {Math.round((Date.now() - time) / 1000)} seconds ago
              <ul>
                {list.map(x => <li key={x}>{x}</li>)}
              </ul>
            </div>
          )
        }
        </Memoize>
      </div>
    );
  }
}

storiesOf('Memoize', module)
  .add('example', () => <Test1/>)
