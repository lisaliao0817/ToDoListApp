import React, { useState, useEffect, useContext } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

const ToDoItem = ({ 
  listId,
  taskId,
  item, 
//   removeTask, 
  level, 
  onCreateTask
}) => {
    const [title, setTitle] = useState(item.title);
    const [status, setStatus] = useState('pending');
    const [isExpanded, setIsExpanded] = useState(true); 
    const navigate = useNavigate();
    const [subTasks, setSubTasks] = useState([]);

    const [lists, setLists] = useState([]);
    const { user } = useContext(UserContext);


    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/api/list', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
                if (response.data) {
                    setLists(response.data);
                } else {
                    window.alert("Error fetching the lists.");
                }
            } catch (error) {
                console.error("Error fetching lists:", error);

                if (error.response && error.response.status === 401 && error.response.data === "Token has expired") {
                    navigate('/login'); // assuming '/login' is your login route
                } else {
                    window.alert("There was an issue fetching your lists. Please try again.");
                }
            }
        };

        if (user) {
            fetchLists();
        }
    }, [user, navigate]);


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
    }, [taskId]);


    const handleCreateSubTask = (listId, title, parentTaskId) => {
        onCreateTask(listId, title, parentTaskId, (newSubTask) => {
            setSubTasks((prevSubTasks) => [...prevSubTasks, newSubTask]);
        });
    };


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

    const removeTask = async (listId, taskId) => {
        try {
            // Call the backend to delete the task
            const response = await axios.delete(`http://127.0.0.1:5000/api/task/${taskId}`);
    
            // Check if the task was successfully deleted
            if (response.status === 200) {
                const newList = lists.map(list => {
                    console.log("task id", taskId);
                    if (list.id === listId) {
                        return {
                            ...list,
                            tasks: list.tasks.filter(task => task.id !== taskId)
                        };
                    }
                    return list;
                });
                setLists(newList);
            } else {
                // Handle any errors returned from the backend
                console.error("Error deleting task:", response.data.error);
            }
        } catch (error) {
            // Handle any other errors (e.g., network errors, backend errors)
            console.error("An error occurred:", error.message);
            if (error.response && error.response.status === 401 && error.response.data === "Token has expired") {
                navigate('/login');
            } else {
                window.alert("There was an issue deleting the task. Please try again.");
            }
        }
    };


    // if (level === 1 && status === 'completed') {
    //     return null; // Do not render top-level completed tasks.
    // }
    
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
                <button onClick={() => removeTask(listId, taskId)} className="focus:outline-none">
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
                                listId={listId}
                                taskId={subTask.id}
                                item={subTask} 
                                removeTask={removeTask} 
                                level={level + 1}
                                onCreateTask={onCreateTask}
                                // onRemoveSubTask={onRemoveSubTask}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default ToDoItem;
