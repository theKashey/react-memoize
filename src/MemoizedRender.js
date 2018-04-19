import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import memoizeState from 'memoize-state';

/* eslint-disable no-underscore-dangle, react/no-multi-comp */

class MemoizedRenderIndirect extends PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
  };

  render() {
    return this.props.value;
  }
}

const deproxifyShouldDive = (data, key, a) => key === '_owner' && a.$$typeof && a._store;

export class MemoizedRender extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
    value: PropTypes.object,
    consumer: PropTypes.any,
  };

  static defaultProps = {
    value: null,
    consumer: null,
  };

  state = {
    children: memoizeState(this.props.children, { flags: { deproxifyShouldDive } }),
  };

  renderProp = value => (
    <MemoizedRenderIndirect value={this.state.children(value)} fn={this.state.children} />
  );

  render() {
    const { value, consumer: Consumer } = this.props;

    if (value) {
      return this.renderProp(value);
    }
    if (this.props.consumer) {
      return <Consumer>{this.renderProp}</Consumer>;
    }
    return null;
  }
}
