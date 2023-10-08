import React, { useState } from 'react';
import TodoItem from './ToDoItem';

function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    const title = prompt("What's the task title?");
    const description = prompt("What's the task description?");
    if (title && description) {
      setTodos([...todos, { title, description }]);
    }
  };

  return (
    <div>
      <button onClick={addTodo}>Add Todo</button>
      <div className="space-y-4">
        {todos.map((todo, index) => (
          <TodoItem key={index} item={todo} />
        ))}
      </div>
    </div>
  );
}

export default TodoList;
