import React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Memoize from '../src';

Enzyme.configure({adapter: new Adapter()});


describe('React memoize', () => {
  it('should render children', () => {
    const trap = jest.fn();

    const render = ({prop1, prop2}) => <div>{prop1} {prop2}</div>
    const compute = x => {
      trap(x);
      return x;
    };

    const wrapper = mount(
      <Memoize
        prop1={1}
        prop2={2}
        compute={compute}
        children={render}
      />
    );
    expect(trap).toHaveBeenCalledWith({prop1: 1, prop2: 2});
    expect(wrapper.text()).toContain('1 2');

    wrapper.setProps({prop3: 3});
    expect(trap).toHaveBeenCalledWith({prop1: 1, prop2: 2, prop3: 3});
    expect(wrapper.text()).toContain('1 2');
  })

  it('should render children', () => {
    const trap = jest.fn();

    const render = ({prop1}) => <div>{prop1}</div>
    const compute = ({prop1}) => {
      trap({prop1});
      return {prop1};
    };

    const wrapper = mount(
      <Memoize
        prop1={1}
        prop2={2}
        compute={compute}
        children={render}
      />
    );

    expect(trap).toHaveBeenCalledWith({prop1: 1});
    expect(trap).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('1');

    wrapper.setProps({prop2: 2});
    expect(trap).toHaveBeenCalledTimes(1);

    wrapper.setProps({prop3: 3});
    expect(trap).toHaveBeenCalledTimes(1);

    wrapper.setProps({prop1: 2});
    expect(trap).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('2');
  })
});