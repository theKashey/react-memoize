import React from 'react';
import PropTypes from 'prop-types';
import memoizeState from 'memoize-state';
import polyfill from "react-lifecycles-compat";

const genFlow = flow => flow.map(fn => memoizeState(fn));

export class MemoizedFlow extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    flow: PropTypes.arrayOf(PropTypes.func).isRequired,
    children: PropTypes.func
  };

  state = {
    flow: genFlow(this.props.flow)
  };

  static getDerivedStateFromProps(props, state) {
    return {
      value: state.flow.reduce((value, fn) => Object.assign({}, value, fn(value)), props.input)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  render() {
    return this.props.children(this.state.value);
  }
};

polyfill(MemoizedFlow);