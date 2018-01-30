import React, {Component} from 'react'
import {render} from 'react-dom'

import { createStore, StoreProvider } from '../../src'
import CreateTodo from './components/CreateTodo';
import TodoList from './components/TodoList';

import actions from './actions';
import state from './state';

const store = createStore(state, actions);
store.onChange(console.log);

render((
    <StoreProvider store={store}>
      <div style={{ width: '40%', margin: '200px auto' }}>
        <div style={{ padding: 20, border: '1px solid #eee', borderRadius: 5 }}>
          <CreateTodo />
          <TodoList />
        </div>
      </div>
    </StoreProvider>
  ),
  document.querySelector('#demo')
);
