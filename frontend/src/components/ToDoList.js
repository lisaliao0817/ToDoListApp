import React, { useState, useEffect } from 'react';
import TodoItem from './ToDoItem';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
    .then(response => response.json())
    .then(data => {
      setTodos(data);
    })
    .catch(error => console.error('Error:', error));
  }, []);  // The empty dependency array ensures this effect runs only once, similar to componentDidMount

  const addTodo = () => {
    const title = prompt("What's the task title?");
    if (title) {
      // Send the task data to the server
      fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, status: 'Pending' }),
      })
      .then(response => response.json())
      .then(data => {
        // On successful response, update the state with the returned task
        setTodos([...todos, data]);
      })
      .catch(error => console.error('Error:', error));
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