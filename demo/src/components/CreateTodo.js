import React from 'react';
import { connect } from '../../../src';

const CreateTodo = (props) => (
  <div style={{ display: 'flex' }}>
    <input
      style={{ flex: 1, lineHeight: 2, padding: '0 8px', fontSize: 16}}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          props.actions.createTodo(props.formValue);
          props.actions.formChange('');
        }
      }}
      onChange={(e) => props.actions.formChange(e.target.value)}
      value={props.formValue}
    />
    <button
      style={{ background: '#333', color: '#fff', fontSize: 16, border: 0, marginLeft: 10, borderRadius: 4 }}
      onClick={() => {
        props.actions.createTodo(props.formValue);
        props.actions.formChange('');
      }}>
      Create
    </button>
  </div>
);

export default connect(
  (s) => ({ formValue: s.formValue })
)(CreateTodo);