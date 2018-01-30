export default function createBuilder(state) {
  let chain = [];

  function build(action, args) {
    // const argz = args.map(arg => {
    //   if (typeof arg !== 'function') {
    //     return arg;
    //   }
    //   return arg(state.state);
    // });

    const ret = action(...args)(utils());
    if (ret === undefined) {
      persist();
      return state;
    }
    return ret;
  }

  function persist() {
    chain.forEach(fn => fn());
    chain = [];
  }

  function toPath(path) {
    return typeof path === 'string' ? path.split('.') : path;
  }
  
  function alterDeep(path, func) {
    path = toPath(path);
    const nextState = { ...state };
    let nextSubState = nextState;
    
    for (var i in path) {
      const key = path[i];
      
      if (i == path.length - 1) {
        func(nextSubState, key);
      } else if (Array.isArray(nextSubState[key])) {
        nextSubState[key] = [ ...nextSubState[key] ];
      } else {
        nextSubState[key] = { ...nextSubState[key] };
      }
      
      nextSubState = nextSubState[key];
    }
    
    return nextState;
  };
  
  function utils() {
    return {
      set,
      removeWhere,
      keepWhere,
      remove,
      add,
      replace,
      map,
      state
    }
  }

  function set(path, funcOrValue) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        if (typeof funcOrValue === 'function') {
          nextSubState[key] = funcOrValue(nextSubState[key]);
        } else {
          nextSubState[key] = funcOrValue;
        }
      });
    });
  }

  function removeWhere(path, predicate) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        nextSubState[key] = nextSubState[key].filter((...args) => !predicate(...args));
      });
    });
  }

  function keepWhere(path, predicate) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        nextSubState[key] = nextSubState[key].filter((...args) => predicate(...args));
      });
    });
  }

  function remove(path) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        if (Array.isArray(nextSubState)) {
          nextSubState.splice(key, 1);
        } else {
          delete nextSubState[key];
        }
      });
    });
  }

  function add(path, value) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        nextSubState[key] = [ ...nextSubState[key], value ];
      });
    });
  }

  function map(path, fn) {
    chain.push(() => {
      state = alterDeep(toPath(path), (nextSubState, key) => {
        nextSubState[key] = nextSubState[key].map(fn);
      });
    });
  }

  function replace(value) {
    chain.push(() => {
      state = value;
    });
  }

  return {
    build,
    persist
  };
}

