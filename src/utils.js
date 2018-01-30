export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

export function getter(target, name, receiver) {
  if (Array.isArray(target) && ['copyWithin', 'fill', 'pop', 'push', 'shift', 'sort', 'splice', 'unshift', 'reverse'].includes(name)) throw new Error('no mutate, slice(0) first');
  if (name === '__as_mutable') return target;
  if (target[name] == null || typeof target[name] !== 'object'){
    if (typeof target[name] === 'function') {
      return target[name].bind(target);
    } else {
      return target[name];
    }
  }
  return new Proxy(target[name], { get: getter });
}

export function createReadOnlyProxy(original) {
  if (typeof original !== 'object') return original;
  return new Proxy(original, {
    get: getter,
    set: function() {
      throw new Error('you may not mutate the state');
    }
  });
}


