import React from 'react';
import { connect } from '../../../src';

const Todo = (props) => (
  <li style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5,
    background: props.todo.completed ? '#e9ffe0' : '#f5f5f5',
    padding: 5, 
    borderRadius: 4,
    fontFamily: 'Arial'
  }}>
    <div style={{ padding: 5 }}>
      <button onClick={() => props.actions.toggleCompletedness(props.todo)}>
        {props.todo.completed ? 'not completed' : 'complete'}
      </button>
    </div>
    <div style={{ flex: 1, padding: 5 }}>
      <div>{props.todo.title}</div>
      <div>{props.todo.date.toString()}</div>
    </div>
    <div style={{ padding: 5 }}>
      <button onClick={() => props.actions.removeTodo(props.todo)}>
        remove
      </button>
    </div>
  </li>
);

export default connect(
  null,
  (actions) => ({
    toggleCompletedness: actions.toggleCompletedness,
    removeTodo: actions.removeTodo
  })
)(Todo);