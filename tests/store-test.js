import expect from 'expect'

import { createStore } from 'src/index'

function createDeepObjectStore(actions) {
  return createStore({ a: { b: { c: 1 }, f: {}}, d: {}, e: 2 }, actions);
}

describe('public api', () => {
  it('contains all expected keys', () => {
    const store = createStore(0);
    expect(typeof store.onChange === 'function').toBe(true);
    expect(typeof store.getState === 'function').toBe(true);
    expect(typeof store.extend === 'function').toBe(true);
    expect(typeof store.actions === 'object').toBe(true);
  });
});

describe('state', () => {
  it('does not modify the state on init', () => {
    const state = {};
    const store = createStore(state);
    expect(store.getState()).toBe(state);
  });

  it('can be any arbritrary type', () => {
    expect(() => {
      createStore(0);
      createStore({});
      createStore([]);
      createStore(new (function ArbritaryFunction() {}));
    }).toNotThrow();
  });

});

describe('actions', () => {
  it('updates to returned state', () => {
    const newState = {};
    const store = createStore({}, { m: () => (state) => newState });
    store.actions.m();
    expect(store.getState()).toBe(newState);
  });

  it('passes along arguments', () => {
    const store = createStore({}, { m: (a, b, c) => () => [a, b, c]});
    store.actions.m(3, 2, 1);
    expect(store.getState()).toEqual([3, 2, 1]);
  });

  it('throws if action function does not return another function', () => {
    expect(() => {
      createStore({}, { m: () => null });
    }).toThrow();

    expect(() => {
      createStore({}, { m: null });
    }).toThrow();
  });
});

describe('builder functions', () => {
  describe('general', () => {
    it('throws when calling an action while another is running', () => {
      let globalStore = null;
      const store = createDeepObjectStore({
        dummyAction: () => () => {},
        modifyDeep: () => (_, { set }) =>
          globalStore.actions.dummyAction()
      });
      globalStore = store;
      expect(store.actions.modifyDeep).toThrow(/while another action is running/);
    });
    
    it('handles strings as paths', () => {
      const store = createDeepObjectStore({
        modifyDeep: () => (_, { set }) =>
          set('a', 9)
      });
      store.actions.modifyDeep();
      const nextState = store.getState();
      expect(nextState).toEqual({ a: 9, d: {}, e: 2 });
    });

    it('handles dot notation strings as path', () => {
      const store = createDeepObjectStore({
        modifyDeep: () => (_, { set }) =>
          set('a.b.c', 9)
      });
      store.actions.modifyDeep();
      const nextState = store.getState();
      expect(nextState).toEqual({
        a: { b: { c: 9 }, f: {}}, d: {}, e: 2
      });
    });

    it('handles an array as path', () => {
      const store = createDeepObjectStore({
        modifyDeep: () => (_, { set }) =>
          set(['a', 'b', 'c'], 9)
      });
      store.actions.modifyDeep();
      const nextState = store.getState();
      expect(nextState).toEqual({
        a: { b: { c: 9 }, f: {}}, d: {}, e: 2
      });
    });
  });

  describe('set', () => {
    it('copies all parent objects but no neighbours', () => {
      const store = createDeepObjectStore({
        modifyDeep: () => (_, { set }) =>
          set(['a', 'b', 'c'], 9)
      });
      const prevState = store.getState();
      store.actions.modifyDeep();
      const nextState = store.getState();
      
      expect(prevState).toNotBe(nextState);
      expect(prevState.a).toNotBe(nextState.a);
      expect(prevState.a.b).toNotBe(nextState.a.b);
      expect(prevState.a.f).toBe(nextState.a.f);
      expect(prevState.d).toBe(nextState.d);
      expect(prevState.e).toBe(nextState.e);
      expect(nextState.a.b.c).toEqual(9);
    });
  });
});

