import React from 'react';
import { connect } from '../../../src';

import Todo from './Todo';

const TodoList = (props) => (
  Boolean(props.todos.length) &&
  <ul style={{ margin: '10px 0 0', padding: 0 }}>
    {props.todos.map(todo => (
      <Todo key={todo.id} todo={todo} />
    ))}
  </ul>
);

export default connect(
  s => ({ todos: s.todos }),
)(TodoList);

