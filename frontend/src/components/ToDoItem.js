import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ToDoItem = ({ 
  listId,
  taskId,
  item, 
  onRemoveTask, 
  level, 
  onCreateTask
}) => {
    const [title, setTitle] = useState(item.title);
    const [status, setStatus] = useState(item.status);
    const [isExpanded, setIsExpanded] = useState(true); 
    const navigate = useNavigate();
    const [subTasks, setSubTasks] = useState([]);



    useEffect(() => {
        const fetchSubTasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/task/${taskId}/subtasks`);
                if (response.status === 200) {
                    setSubTasks(response.data);
                } else {
                    console.error("Error fetching subtasks:", response.data.error);
                }
            } catch (error) {
                console.error("An error occurred when fetching subtasks:", error.message);
            }
        };
        fetchSubTasks();
    }, [taskId, onRemoveTask]);


    const handleCreateSubTask = (listId, title, parentTaskId) => {
        onCreateTask(listId, title, parentTaskId, (newSubTask) => {
            setSubTasks((prevSubTasks) => [...prevSubTasks, newSubTask]);
        });
    };

    const handleRemoveSubTask = (listId, taskId) => {
        onRemoveTask(listId, taskId, (oldSubTask) => {
            setSubTasks((prevSubTasks) => prevSubTasks.filter(subTask => subTask !== oldSubTask));
        });
    };
    
    const updateTaskStatus = async (newStatus) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/task/${taskId}`, { 
                title: title, // keep the title unchanged
                status: newStatus
            });

            if (response.status === 200) {
                setStatus(newStatus);
            } else {
                console.error("Error updating task status:", response.data.error);
            }
        } catch (error) {
            console.error("An error occurred while updating task status:", error.message);
            if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                window.alert("Your token has expired. Please log in again.");
                navigate('/login'); 
            }
            else {
                window.alert("There was an issue updating the task status. Please try again.");
            }
        }
    };



    const markComplete = () => {
        updateTaskStatus('completed');
    };

    const undoComplete = () => {
        updateTaskStatus('pending');
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
                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    window.alert("Your token has expired. Please log in again.");
                    navigate('/login'); 
                }
                else {
                    window.alert("There was an issue moving the task. Please try again.");
                }
            }
        }
    };

    
    return (
        <div className="my-1">
            <div className="flex items-start space-x-2 group">
                {item.children && item.children.length > 0 && (
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
                <button onClick={() => handleRemoveSubTask(listId, taskId)} className="focus:outline-none">
                    <TrashIcon className="h-5 w-5 hover:text-gray-500" />
                </button>
                {level < 3 && (
                    // <button onClick={() => onCreateTask(listId, prompt('Enter subtask title'), taskId)} className="focus:outline-none">
                    <button onClick={() => handleCreateSubTask(listId, prompt('Enter subtask title'), taskId)} className="focus:outline-none">
                        <PlusIcon className="h-5 w-5 hover:text-gray-500" />
                    </button>
                )}
                </div>
            </div>
            {isExpanded && subTasks && (
                <ul className="pl-2">
                    {subTasks.map(subTask => (
                        <li key={subTask.id} className="pl-5 pb-1">
                            <ToDoItem 
                                taskId={subTask.id}
                                item={subTask} 
                                level={level + 1}
                                listId={listId}
                                onCreateTask={onCreateTask}
                                onRemoveTask={onRemoveTask} 
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default ToDoItem;
