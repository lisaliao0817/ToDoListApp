

import React  from 'react';
import ToDoItem from './ToDoItem';
import { Draggable } from 'react-beautiful-dnd';
import { PlusCircleIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const ToDoList = ({ listId, tasks, createTask, removeTask, removeSubTaskFromTask, removeList, listName, updateListTitle }) => {

  const editListTitle = () => {
    const newListName = prompt('Edit list title', listName);
    if (newListName && updateListTitle) {
        updateListTitle(listId, newListName);
    }
}


    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-10 min-w-full group/list">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-4">{listName}</h2>
        <div className='group-hover/list:opacity-100 group-hover/list:visible opacity-0 invisible'>
        <button onClick={editListTitle} className="focus:outline-none">
                <PencilSquareIcon className="h-5 w-5 mb-3 cursor-pointer hover:text-gray-500 " />
            </button>
        <button onClick={removeList} title="Delete List">
                <TrashIcon className="h-5 w-5 mb-3 cursor-pointer hover:text-gray-500  ml-1" />
            </button>
            </div>
            </div>
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
                      taskId={task.id} 
                      item={task} 
                      level={1}
                      listId={listId} // Pass the listId
                      // onCreateTask={(parentId, title) => createTask(listId, parentId, title)}
                      onCreateTask={(listId, title, parentId, callback) => createTask(listId, title, parentId, callback)}
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
              onClick={() => createTask(listId, prompt('Enter task title'))}>
                    <PlusCircleIcon className="h-5 w-5 hover:text-gray-500" />
                </button>
            </div>
        </div>
    );
};

export default ToDoList;
