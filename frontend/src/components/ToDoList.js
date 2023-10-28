

import React from 'react';
import ToDoItem from './ToDoItem';
import { Draggable } from 'react-beautiful-dnd';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

const ToDoList = ({ listId, tasks, addTask, removeTask, addSubTaskToTask, removeSubTaskFromTask }) => {

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-10 min-w-full">
            <h2 className="text-xl font-semibold mb-4">ToDo List</h2>
            <div className="space-y-2">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <ToDoItem 
                      key={task.id} 
                      item={task} 
                      level={1}
                      listId={listId} // Pass the listId
                      onAddSubTask={(parentId, title) => addSubTaskToTask(listId, parentId, title)}
                      onRemoveSubTask={(taskId) => removeSubTaskFromTask(listId, taskId)}
                      removeTask={() => removeTask(listId, task.id)} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            </div>
            <div className="mt-4">
            <button 
              onClick={() => addTask(listId, prompt('Enter task title'))}>
                    <PlusCircleIcon className="h-5 w-5 hover:text-gray-500" />
                </button>
            </div>
        </div>
    );
};

export default ToDoList;
