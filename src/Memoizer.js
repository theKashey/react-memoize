import React, { Component } from 'react';
import PropTypes from 'prop-types';
import polyfill from 'react-lifecycles-compat';

import memoizeState from 'memoize-state';
import memoizeOne from 'memoize-one';

const createMemoizer = (memoizationFunction) => {
  class Memoize extends Component {
    static propTypes = {
      children: PropTypes.func.isRequired,
      compute: PropTypes.func.isRequired,
      pure: PropTypes.bool,
    };

    static defaultProps = {
      pure: false,
    };

    state = {
      calculateResult: memoizationFunction(this.props.compute),
    };

    static getDerivedStateFromProps(props, state) {
      const { calculateResult, result: oldResult } = state;
      const { children, compute, pure, ...rest } = props;
      const result = state.calculateResult(rest);
      const changed = oldResult !== result;
      return {
        calculateResult,
        result,
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !nextProps.pure || nextState.result!==this.state.result;
    }

    render() {
      return this.props.children(this.state.result);
    }
  }

  polyfill(Memoize);
  return Memoize;
};

export const MemoizeOne = createMemoizer(memoizeOne);
export const MemoizeState = createMemoizer(memoizeState);

export default MemoizeState;