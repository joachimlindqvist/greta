# Greta

## Basic Usage
```
  const actions = {
    increment: () => ({ state }) => state + 1,
    decrement: () => ({ state }) => state - 1,
  }

  const initialState = 0;

  store = createStore(initialState, actions);

  store.getState(); // = 0

  store.actions.increment();
  store.actions.increment();
  store.actions.decrement();

  store.getState(); // = 1
```

## Actions
Actions are functions returning builder functions. The builder function receives an object with the current state and utility functions.

If the builder function returns something the returned values replaces the current state. Otherwise the next state will be built by the util functions. Returning the next state and using the util function cannot be done in the same builder function.

State version:
```
  function addTodo(todo) {
    return function({ state }) {
      return { ...state, todos: [ ...state, todo ]};
    }
  }
```

Util function version:
```
  function addTodo(todo) {
    return function({ add }) {
      add('todos', todo)
    }
  }
```

## Utils 

Most utility functions take a path as the first argument. The path can be a dot-separated string or an array.

### State

The complete state is available in `utils.state`.

```
  const addTodo = todo => ({ state }) => (
    { ...state, todos: [ ...state.todos, todo ]}
  )
```

### Set

Sets the value in the path provided. If the second argument is a function it will be called with the current value in the path.

```
  const replaceFirstTodo = todo => utils =>
    utils.set(['todos', 0], todo)

  const uppercaseFirstTodo = () => utils =>
    utils.set(['todos', 0], (todo) => (
      { ...todo, title: todo.title.toUpperCase() }
    ))
```

### Add

Appends a value to the end of an array.

```
  const addTodo = todo => utils =>
    utils.add('todos', todo)
```

### Remove where

Removes all matching items in an array.

```
  const removeWithTitle = title => utils =>
    utils.removeWhere('todos', (todo) => todo.title === title)
```

### Keep where

Reverse of `removeWhere`. It removes all items not matching.

```
  const keepWithTitle = title => utils =>
    utils.keepWhere('todos', (todo) => todo.title === title)
```

### Remove

Remove an item in either an array or an object.

```
  const removeSecondTodo = () => utils =>
    utils.remove('todos.1')
```

### Map

Modify an array.

```
  const lowerCaseAllTodoTitles = () => utils =>
    utils.map('todos', (todo) => ({
      ...todo,
      title: todo.title.toLowerCase(),
    }))
```

### Replace

Replaces the whole state.

```
  const deleteEverything = () => utils =>
    utils.replace(null)
```

# React bindings

## StoreProvider

All components depending on the store must be children of a `StoreProvider`.

```
  const store = createStore(0);
  const App = (
    <StoreProvider store={store}>
      <Component />
    </StoreProvider>
  );
```

## Connect

Use `connect` to connect the store to a react component. 

The first argument maps the state to the components props. If it's a falsy value _no_ props from the state will be set.

The second argument maps the actions to the components `actions` prop. If it's a falsy value _all_ actions will be available in the `actions` prop in the component.

```
  const ConnectedComponent = connect(
    (state) => ({ todos: state.todos }),
    (actions) => ({ addTodo: actions.addTodo, removeTodo: actions.removeTodo }),
  )(Component)
```