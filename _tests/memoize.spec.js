import React from 'react';
import createContext from 'create-react-context';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Memoize, {MemoizeContext} from '../src';

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

  it('should render children - pure', () => {
    const computeTrap = jest.fn();
    const trap1 = jest.fn();
    const trap2 = jest.fn();

    const render1 = ({prop1, prop2}) => {
      trap1();
      return <div>{prop1} {prop2}</div>
    }
    const render2 = ({prop1, prop2}) => {
      trap2();
      return <div>{prop1} {prop2}</div>
    }

    const compute = ({prop1, prop2}) => {
      computeTrap();
      return {prop1, prop2};
    };

    const wrapper1 = mount(
      <Memoize
        prop1={1}
        prop2={2}
        compute={compute}
        children={render1}
      />
    );

    const wrapper2 = mount(
      <Memoize
        prop1={1}
        prop2={2}
        compute={compute}
        children={render2}
        pure
      />
    );

    expect(wrapper1.text()).toContain('1 2');
    expect(wrapper2.text()).toContain('1 2');
    expect(computeTrap).toHaveBeenCalledTimes(2);
    expect(trap1).toHaveBeenCalledTimes(1);
    expect(trap2).toHaveBeenCalledTimes(1);

    wrapper1.setProps({prop3: 3});
    wrapper2.setProps({prop3: 3});

    expect(computeTrap).toHaveBeenCalledTimes(2);
    expect(trap1).toHaveBeenCalledTimes(2);
    expect(trap2).toHaveBeenCalledTimes(1);

    wrapper1.setProps({prop1: 2});
    wrapper2.setProps({prop1: 2});

    expect(computeTrap).toHaveBeenCalledTimes(4);
    expect(trap1).toHaveBeenCalledTimes(3);
    expect(trap2).toHaveBeenCalledTimes(2);

    expect(wrapper1.text()).toContain('2 2');
    expect(wrapper2.text()).toContain('2 2');
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
  });

  it('memoized context selector', async () => {
    const trap = jest.fn();

    const Render = (props) => {
      trap(props);
      return null;
    };

    const select = ({prop1, prop2}) => {
      return {prop1, prop2};
    };

    const Context = createContext('test');

    const wrapper = mount(
      <Context.Provider value={{prop1: 1, prop2: 2, prop3: 3}}>
        <MemoizeContext consumer={Context.Consumer} selector={select}>
          {values => <Render {...values} />}
        </MemoizeContext>
      </Context.Provider>
    );

    expect(trap).toHaveBeenCalledWith({prop1: 1, prop2: 2});
    expect(trap).toHaveBeenCalledTimes(1);

    wrapper.setProps({value: {prop1: 1, prop2: 2, prop3: 3.5, prop4: 4}});

    await Promise.resolve();

    expect(trap).toHaveBeenCalledWith({prop1: 1, prop2: 2});
    expect(trap).toHaveBeenCalledTimes(1);

    wrapper.setProps({value: {prop1: 2, prop2: 2}});

    await Promise.resolve();

    expect(trap).toHaveBeenCalledTimes(2);
    expect(trap).toHaveBeenCalledWith({prop1: 2, prop2: 2});
  });
});