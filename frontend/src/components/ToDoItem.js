import React from 'react';

function TodoItem({ item }) {
  return (
    <div className="task-container">
      <div className="task-title">{item.title}</div>
      <div className="task-description">{item.description}</div>
      {item.subItems && item.subItems.length > 0 && (
        <ul className="sub-tasks">
          {item.subItems.map(subItem => (
            <li key={subItem.id}>
              <TodoItem item={subItem} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoItem;
