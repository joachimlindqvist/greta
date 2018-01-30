import invariant from 'invariant';
import createBuilder from './createBuilder';
import { compose } from './utils';

export default function createStore(defaultState, actions = {}, middlewares = []) {

  let currentState = defaultState;
  let listeners = [];
  let extended = {};
  let isRunningAction = false;

  const composedRun = compose(...middlewares.map(
    middelware => middelware({ run: _run, getState })
  ))(_run);

  validateActions();

  function validateActions() {
    if (process.env.NODE_ENV === 'PRODUCTION') return;

    Object.keys(actions).forEach(key => {
      invariant(
        typeof actions[key] === 'function' &&
        typeof actions[key]() === 'function',
        'Actions must be a function returning another builder function.\n' +
        'Example:\n' +
        '{\n' +
        '  addTodo: function(title) {\n' +
        '    return function(state) {\n' +
        '      return [ ...state, { title } ]\n' +
        '    };\n' +
        '  }\n' +
        '}'
      );
    });
  }

  function _run({ action, args }) {
    isRunningAction = true;
    const builder = createBuilder(currentState);
    args = (args || []);
    const nextState = builder.build(action, args);
    // currentState = applyExtenders(builder, action.name);
    isRunningAction = false;
    if (nextState !== currentState) {
      currentState = nextState;
      listeners.forEach(listener => listener(currentState));
    }
  }

  function getState() {
    return currentState;
  }

  function run(action, ...args) {
    if (typeof action !== 'function') {
      throw new Error('action must be a function');
    }

    invariant(isRunningAction !== true, 'Cannot run a second action while another action is running.');

    return composedRun({ action, args });
  }

  function onChange(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  function applyExtenders(builder, key) {
    if (extended[key] == null) {
      return currentState;
    }

    extended[key].forEach(ext => {
      currentState = builder.build(() => ext, [])
    });

    return currentState;
  }

  function extend(key, fn) {
    key = typeof key === 'function' ? key.name : key;
    if (extended[key] == null) {
      extended[key] = [];
    }
    extended[key].push(fn);
  }

  function boundActions() {
    const bound = {};
    Object.keys(actions).forEach((key) => {
      bound[key] = (...args) => run(actions[key], ...args);
    });
    return bound;
  }

  return {
    onChange,
    getState,
    extend,
    actions: boundActions(),
  };
}

