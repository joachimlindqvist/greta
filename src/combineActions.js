import invariant from 'invariant';

export default function combineActions(actionList) {
  invariant(Array.isArray(actionList), "First argument must be an array for combineActions");
  const combined = {};
  actionList.forEach((actions) => Object.assign(combined, actions));
  return combined;
}

