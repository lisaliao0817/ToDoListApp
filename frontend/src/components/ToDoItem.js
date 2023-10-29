import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Modal from '../components/Modal';

const ToDoItem = ({ 
  item, 
  removeTask, 
  level, 
  onAddSubTask, 
  onRemoveSubTask,
  openTaskModal
}) => {
    const [title, setTitle] = useState(item.title);
    const [status, setStatus] = useState('pending');
    const [isExpanded, setIsExpanded] = useState(true); 

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);

const handleEditSubmit = () => {
    setTitle(editedTitle);
    setIsEditModalOpen(false);
};


    const markComplete = () => {
        setStatus('completed');
    };

    const undoComplete = () => {
        setStatus('pending');
    };

    // const editTask = () => {
    //     const newTitle = prompt('Edit task title', title);
    //     if (newTitle) {
    //         setTitle(newTitle);
    //     }
    // };

    // if (level === 1 && status === 'completed') {
    //     return null; // Do not render top-level completed tasks.
    // }
    
    return (
        <div className="my-1">
            <div className="flex items-start space-x-2 group/item">
                {item.subtasks && item.subtasks.length > 0 && (
                  <div className='mt-1'>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="focus:outline-none">
                        {isExpanded ? <ChevronDownIcon className="h-5 w-5 text-gray-500" /> : <ChevronRightIcon className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                )}
                <div>
                <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={status === 'completed' ? undoComplete : markComplete}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
                </div>
                <div className={`flex-grow ${status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`} >
                    {title}
                </div>
                <div className='flex space-x-1 mt-1 group-hover/item:opacity-100 group-hover/item:visible opacity-0 invisible'>
                <button onClick={() => setIsEditModalOpen(true)} className="focus:outline-none">
                    <PencilSquareIcon className="h-5 w-5 hover:text-gray-500" />
                </button>
                <button onClick={() => removeTask(item.id)} className="focus:outline-none">
                    <TrashIcon className="h-5 w-5 hover:text-gray-500" />
                </button>
                {level < 3 && (
                    <button onClick={() => onAddSubTask(item.id, prompt('Enter subtask title'))} className="focus:outline-none">
                        <PlusIcon className="h-5 w-5 hover:text-gray-500" />
                    </button>
                )}

                <Modal 
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        title="Edit Task"
                        placeholder="Enter new task title"
                        onSubmit={handleEditSubmit}
                        initialInputValue={editedTitle}
                    />        

                </div>
            </div>
            {isExpanded && item.subtasks && (
                <ul className="pl-2">
                    {item.subtasks.map(subTask => (
                        <li key={subTask.id} className="pl-5 pb-1">
                            <ToDoItem 
                                item={subTask} 
                                removeTask={onRemoveSubTask} 
                                level={level + 1}
                                onAddSubTask={onAddSubTask}
                                onRemoveSubTask={onRemoveSubTask}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default ToDoItem;