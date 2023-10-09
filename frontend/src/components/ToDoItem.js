import React, { useState } from 'react';

function TodoItem({ item, depth = 0, onDelete, onUpdate }) {
  const [subItems, setSubItems] = useState(item.subItems || []);
  const [status, setStatus] = useState(item.status || 'Pending');

  const addSubTask = () => {
    const title = prompt("Enter the subtask's title:");
    if (title) {
      const newSubItem = { title, id: Date.now(), status: 'Pending' };  // Use a simple ID generation for demo
      setSubItems([...subItems, newSubItem]);
    }
  };

  const toggleStatus = () => {
    const newStatus = status === 'Pending' ? 'Completed' : 'Pending';
    setStatus(newStatus);
    // Assuming you have an API endpoint to update the task
    onUpdate(item.id, { status: newStatus });
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleUpdate = () => {
    const newTitle = prompt("Enter the new title:", item.title);
    if (newTitle) {
      onUpdate(item.id, { title: newTitle });
    }
  };

  return (
    <div className="task-container">
      <div className="flex h-6 items-center">
        <input
          type="checkbox"
          checked={status === 'Completed'}
          onChange={toggleStatus}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <div className="task-title">{item.title}</div>
        <button onClick={handleUpdate}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>

      {depth < 2 && (
        <button onClick={addSubTask} className="add-subtask-btn">
          Add Subtask
        </button>
      )}

      {subItems.length > 0 && (
        <ul className="sub-tasks">
          {subItems.map(subItem => (
            <li key={subItem.id}>
              <TodoItem item={subItem} depth={depth + 1} onDelete={onDelete} onUpdate={onUpdate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoItem;

