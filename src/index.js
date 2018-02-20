import { Component } from 'react';
import PropTypes from 'prop-types';

import memoizeState from 'memoize-state';
import memoizeOne from 'memoize-one';

const createMemoizer = memoizationFunction => (
  class Memoize extends Component {
    static propTypes = {
      children: PropTypes.func.isRequired,
      compute: PropTypes.func.isRequired,
    };

    constructor(props, context) {
      super(props, context);
      this.calculateResult = memoizationFunction(props.compute);
    }

    render() {
      const { children, compute, ...props } = this.props;
      return children(this.calculateResult(props));
    }
  }
);

export const MemoizeOne = createMemoizer(memoizeOne);
export const MemoizeState = createMemoizer(memoizeState);

const MemoizeDefault = typeof Proxy !== 'undefined' ? MemoizeState : MemoizeOne;

export default MemoizeDefault;
