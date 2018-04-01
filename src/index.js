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

    static getDerivedStateFromProps(props, state) {
      const { calculateResult, result: oldResult } = state;
      const { children, compute, pure, ...rest } = props;
      const result = state.calculateResult(rest);
      const changed = oldResult !== result;
      return {
        calculateResult,
        changed,
        result,
      };
    }

    constructor(props, context) {
      super(props, context);
      this.state = Memoize.getDerivedStateFromProps(props, {
        calculateResult: memoizationFunction(props.compute),
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !nextProps.pure || nextState.changed;
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

export const MemoizeContext = ({ consumer: Consumer, selector, pure, children, ...rest }) => (
  <Consumer {...rest}>
    {values =>
      (<MemoizeState {...values} compute={selector} pure={pure}>
        {result => children(result)}
      </MemoizeState>)
    }
  </Consumer>
);

MemoizeContext.propTypes = {
  children: PropTypes.func.isRequired,
  selector: PropTypes.func.isRequired,
  consumer: PropTypes.any.isRequired,
  pure: PropTypes.bool,
};

MemoizeContext.defaultProps = {
  pure: true,
};


const MemoizeDefault = MemoizeState;

export default MemoizeDefault;
