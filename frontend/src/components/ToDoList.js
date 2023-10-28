import React, { useState } from 'react';
import ToDoItem from './ToDoItem';

const ToDoList = () => {
    const [tasks, setTasks] = useState([]);

    const addTask = (title) => {
        const newTask = {
            id: Date.now(),
            title: title,
            subtasks: [],
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const addSubTaskToTask = (parentId, title) => {
      const newTask = {
          id: Date.now(),
          title: title,
          subtasks: [],
      };
      
      const addSubTaskRecursive = (tasks) => {
          return tasks.map(task => {
              if (task.id === parentId) {
                  return {
                      ...task,
                      subtasks: [...task.subtasks, newTask]
                  };
              } else {
                  return {
                      ...task,
                      subtasks: addSubTaskRecursive(task.subtasks)
                  };
              }
          });
      }

      setTasks(addSubTaskRecursive(tasks));
  };

  const removeSubTaskFromTask = (taskId) => {
      const removeSubTaskRecursive = (tasks) => {
          return tasks.filter(task => task.id !== taskId).map(task => ({
              ...task,
              subtasks: removeSubTaskRecursive(task.subtasks)
          }));
      };

      setTasks(removeSubTaskRecursive(tasks));
  };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-10 w-full">
            <h2 className="text-xl font-semibold mb-4">ToDo List</h2>
            <div className="space-y-2">
                {tasks.map(task => (
                    <ToDoItem 
                        key={task.id} 
                        item={task} 
                        removeTask={removeTask} 
                        level={1}
                        onAddSubTask={addSubTaskToTask}
                        onRemoveSubTask={removeSubTaskFromTask}
                    />
                ))}
            </div>
            <div className="mt-4">
                <button 
                    onClick={() => addTask(prompt('Enter task title'))}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default ToDoList;
