import React from 'react';
import MemoizeState from './Memoizer';
import PropTypes from "prop-types";

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