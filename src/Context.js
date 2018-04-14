import React from 'react';
import PropTypes from 'prop-types';
import MemoizedState from './Memoizer';


export const MemoizeContext = ({ consumer: Consumer, selector, pure, children, ...rest }) => (
  <Consumer {...rest}>
    {values =>
      (<MemoizedState {...values} compute={selector} pure={pure}>
        {result => children(result)}
      </MemoizedState>)
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
