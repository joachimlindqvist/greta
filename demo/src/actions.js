import { combineActions } from "../../src/index";

const formActions = {
  formChange: (value) => ({ set }) =>
    set('formValue', value),
  formReset: (value) => ({ set }) =>
    set('formValue', ''),
}

const todoActions = {
  createTodo: (title) => ({ add }) => {
    if (title.length === 0) return;

    add('todos', {
      id: Math.random().toString(),
      title,
      completed: false,
      date: new Date()
    });
  },
  toggleCompletedness: (todo) => ({ map }) =>
    map('todos', (cur) => {
      if (cur.id === todo.id) {
        return { ...cur, completed: !cur.completed };
      }
      return cur;
    }),
  removeTodo: (todo) => ({ removeWhere }) =>
    removeWhere('todos', (cur) => todo.id === cur.id),
};

export default combineActions([
  formActions,
  todoActions,
]);