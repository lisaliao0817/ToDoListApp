import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ToDoItem = ({ 
  taskId,
  item, 
  removeTask, 
  level, 
  onAddSubTask, 
  onRemoveSubTask
}) => {
    const [title, setTitle] = useState(item.title);
    const [status, setStatus] = useState('pending');
    const [isExpanded, setIsExpanded] = useState(true); 
    const navigate = useNavigate();

    const markComplete = () => {
        setStatus('completed');
    };

    const undoComplete = () => {
        setStatus('pending');
    };

    const editTask = async (taskId, title, status) => {
        const newTitle = prompt('Edit task title', title);
        if (newTitle) {
            try {
                // Call the backend to update the task
                console.log("Task ID:", taskId);
                const response = await axios.put(`http://127.0.0.1:5000/api/task/${taskId}`, { 
                    title: newTitle,
                    status: status  // Assuming you want to send the current status
                });
    
                // Check if the task was successfully updated
                if (response.status === 200) {
                    setTitle(newTitle);  // Update the frontend state for title
                    // Optionally, update any other frontend states if required
                } else {
                    // Handle any errors returned from the backend
                    console.error("Error updating task:", response.data.error);
                }
            } catch (error) {
                // Handle any other errors (e.g., network errors)
                console.error("An error occurred:", error.message);
                if (error.response && error.response.status === 401 && error.response.data === "Token has expired") {
                    navigate('/login'); 
                }
                else {
                    window.alert("There was an issue moving the task. Please try again.");
                }
            }
        }
    };

    if (level === 1 && status === 'completed') {
        return null; // Do not render top-level completed tasks.
    }
    
    return (
        <div className="my-1">
            <div className="flex items-start space-x-2 group">
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
                <div className='flex space-x-1 mt-1 group-hover:opacity-100 group-hover:visible opacity-0 invisible'>
                <button onClick={() => editTask(taskId, title, status)} className="focus:outline-none">
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
