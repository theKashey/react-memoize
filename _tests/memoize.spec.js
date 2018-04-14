import React from 'react';
import createContext from 'create-react-context';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Memoize, {MemoizeContext, MemoizedFlow} from '../src';

Enzyme.configure({adapter: new Adapter()});


describe('React memoize', () => {
  describe('memoize', () => {
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

  });

  describe('context', () => {
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

  describe('flow', () => {
    it('the flow', () => {
      let lastState = 0;
      const StateReporter = ({state}) => {
        lastState = state;
        return state.list.reduce((acc, x) => acc + x, 0);
      };

      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();

      const withSpy = (spy, fn) => {
        spy();
        return fn()
      };

      const ItoI = i => i;
      const input = {list: [1, 2, 3, 4, 5, 6], page: 0, sortOrder: 1, filter: ItoI};

      const wrapper = mount(
        <MemoizedFlow
          input={input}
          flow={[
            ({list, filter}) => withSpy(spy1, () => ({list: list.filter(filter)})),
            ({list, sortOrder}) => withSpy(spy2, () => ({list: list.slice().sort((a, b) => sortOrder * (a - b))})),
            ({list, page}) => withSpy(spy3, () => ({list: list.slice(page, page + 2)})),
            ({filter}) => ({filter: null})
          ]}>
          {(output) => <StateReporter state={output}/>}
        </MemoizedFlow>
      )

      expect(wrapper.text()).toBe('3');
      expect(lastState).toEqual({list: [1, 2], page: 0, sortOrder: 1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(1);

      wrapper.setProps({input:{...input, page:1}});
      expect(wrapper.text()).toBe('5');
      expect(lastState).toEqual({list: [2, 3], page: 1, sortOrder: 1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy3).toHaveBeenCalledTimes(2);

      { //repeat
        wrapper.setProps({input: {...input, page: 1}});
        expect(wrapper.text()).toBe('5');
        expect(lastState).toEqual({list: [2, 3], page: 1, sortOrder: 1, filter: null});

        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
        expect(spy3).toHaveBeenCalledTimes(2);
      }

      wrapper.setProps({input:{...input, filter: x => x%2}});
      expect(wrapper.text()).toBe('4');
      expect(lastState).toEqual({list: [1, 3], page: 0, sortOrder: 1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(2);
      expect(spy2).toHaveBeenCalledTimes(2);
      expect(spy3).toHaveBeenCalledTimes(3);

      wrapper.setProps({input:{...input}});
      expect(wrapper.text()).toBe('3');
      expect(lastState).toEqual({list: [1, 2], page: 0, sortOrder: 1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(3);
      expect(spy2).toHaveBeenCalledTimes(3);
      expect(spy3).toHaveBeenCalledTimes(4);

      wrapper.setProps({input:{...input, sortOrder: -1 }});
      expect(wrapper.text()).toBe('11');
      expect(lastState).toEqual({list: [6, 5], page: 0, sortOrder: -1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(3);
      expect(spy2).toHaveBeenCalledTimes(4);
      expect(spy3).toHaveBeenCalledTimes(5);

      // try reset flow
      wrapper.setProps({input:{...input, sortOrder: -1 }, flow:[]});
      expect(wrapper.text()).toBe('11');
      expect(lastState).toEqual({list: [6, 5], page: 0, sortOrder: -1, filter: null});

      expect(spy1).toHaveBeenCalledTimes(3);
      expect(spy2).toHaveBeenCalledTimes(4);
      expect(spy3).toHaveBeenCalledTimes(5);
    })
  });

});