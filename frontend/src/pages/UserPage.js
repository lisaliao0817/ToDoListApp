import axios from 'axios';
import UserContext from '../UserContext';
import Header from '../components/Header';
import ToDoList from '../components/ToDoList';
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';


const UserPage = () => {
    const [lists, setLists] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();


    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('jwtToken');
        if (token) {
            // Set the token in axios defaults for subsequent API calls
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

            // Set the user in the UserContext
            const userEmail = localStorage.getItem('userEmail');
            setUser({ email: userEmail, token: token });
        }
    }, [setUser]);


    // The useEffect hook is used to fetch lists from the server. 
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

                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    window.alert("Your token has expired. Please log in again.");
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


    // The addNewList function prompts the user for a list title and then makes an API call to create the list
    const addNewList = async () => {
        const title = window.prompt("Enter the title for the new list:");

        if (title) {
            try {
                const response = await axios.post('http://127.0.0.1:5000/api/list', { name: title }, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (response.data && response.data.id) {
                    setLists([...lists, { id: response.data.id, name: title, tasks: [] }]);
                } else {
                    window.alert("Error creating the list.");
                }
            } catch (error) {
                console.error("Error creating list:", error);

                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    window.alert("Your token has expired. Please log in again.");
                    navigate('/login');
                } else {
                    window.alert("There was an issue creating the list. Please try again.");
                }
            }
        }
    };



    // The removeList function takes the listId as an argument and deletes the list from the database
    const removeList = async (listId) => {
        // Prompt the user for confirmation
        const isConfirmed = window.confirm("Are you sure you want to delete this list?");

        // If the user clicks "Cancel", exit the function
        if (!isConfirmed) return;

        try {
            // API call to delete the list
            const response = await axios.delete(`http://127.0.0.1:5000/api/list/${listId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status === 200) {
                // If successful, update the state
                const newList = lists.filter(list => list.id !== listId);
                setLists(newList);
            } else {
                console.error("Failed to delete the list: ", response.data.error);
            }
        } catch (error) {
            console.error("Error deleting the list: ", error);

            if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                window.alert("Your token has expired. Please log in again.");
                navigate('/login');
            }
        }
    };


    // The handleOnDragEnd function is called when a task is dragged and dropped.
    const handleOnDragEnd = async (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const newLists = [...lists];

        if (source.droppableId !== destination.droppableId) {
            // If in different lists, move the task
            const sourceList = newLists.find(list => list.id === parseInt(source.droppableId));
            const destList = newLists.find(list => list.id === parseInt(destination.droppableId));
            const [taskToMove] = sourceList.tasks.splice(source.index, 1);
            destList.tasks.splice(destination.index, 0, taskToMove);

            // Make the API call to update the task's list_id in the backend
            try {
                const response = await axios.put(`http://127.0.0.1:5000/api/task/${taskToMove.id}/move/${destList.id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                });

                if (response.status !== 200) {
                    throw new Error(response.data.error);
                }
            } catch (error) {
                console.error("Failed to move the task:", error);
                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    window.alert("Your token has expired. Please log in again.");
                    navigate('/login');
                }
                else {
                    window.alert("There was an issue moving the task. Please try again.");
                }
            }
        } else {
            // If in different lists, move the task
            const sourceList = newLists.find(list => list.id === parseInt(source.droppableId));
            const destList = newLists.find(list => list.id === parseInt(destination.droppableId));
            const [taskToMove] = sourceList.tasks.splice(source.index, 1);
            destList.tasks.splice(destination.index, 0, taskToMove);
        }

        setLists(newLists);
    };


    // The createTask function takes the listId and title as arguments and creates a new task in the database
    const createTask = async (listId, title, parentId = null, callback) => {
        if (!title || title.trim() === "") {
            window.alert("Task title cannot be empty!");
            return;
        }

        const newTask = {
            title: title.trim(),
            children: [],
        };

        try {
            const response = await axios.post(`http://127.0.0.1:5000/api/list/${listId}/task`, {
                title: newTask.title,
                parent_id: parentId
            }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const { message, id } = response.data;

            if (message && message === "Task added successfully") {
                newTask.id = id;

                const addTaskRecursive = (tasks) => {
                    if (!tasks) return [];

                    if (!parentId) {
                        return [...tasks, newTask];
                    }

                    return tasks.map(task => {
                        if (task.id === parentId) {
                            return {
                                ...task,
                                children: [...(task.children || []), newTask]
                            };
                        } else {
                            return {
                                ...task,
                                children: addTaskRecursive(task.children || [])
                            };
                        }
                    });
                }

                const newList = lists.map(list => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            tasks: addTaskRecursive(list.tasks)
                        };
                    }
                    return list;
                });
                setLists(newList);
                console.log("newTask", newTask.id);

                if (callback && typeof callback === 'function') {
                    callback(newTask);
                }
            } else {
                console.error("Error adding task or subtask:", response.data.error);
            }

        } catch (error) {
            console.error("API call failed:", error);
            if (error.response && error.response.data && error.response.data.error) {
                window.alert(`Error: ${error.response.data.error}`);
                if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                    window.alert("Your token has expired. Please log in again.");
                    navigate('/login');
                }
            } else {
                console.error(error);
                window.alert("An unexpected error occurred.");
            }
        }
    };


    // The removeTask function takes the listId and taskId as arguments and deletes the task from the database
    const removeTask = async (listId, taskId, callback) => {
        try {
            // Call the backend to delete the task
            const response = await axios.delete(`http://127.0.0.1:5000/api/task/${taskId}`);

            // Check if the task was successfully deleted
            if (response.status === 200) {
                const removeTaskFromChildren = (tasks) => {
                    return tasks.reduce((acc, task) => {
                        if (task.id === taskId) {
                            // If this task matches, don't include it in the new list
                            return acc;
                        } else {
                            // Otherwise, check its children
                            const updatedChildren = removeTaskFromChildren(task.children || []);
                            return [...acc, { ...task, children: updatedChildren }];
                        }
                    }, []);
                };

                const newList = lists.map(list => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            tasks: removeTaskFromChildren(list.tasks)
                        };
                    }
                    return list;
                });

                setLists(newList);

                if (callback && typeof callback === 'function') {
                    callback(newList);
                }
            } else {
                console.error("Error deleting task:", response.data.error);
            }
        } catch (error) {
            console.error("An error occurred:", error.message);
            if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                window.alert("Your token has expired. Please log in again.");
                navigate('/login');
            } else {
                window.alert("There was an issue deleting the task. Please try again.");
            }
        }
    };


    // The updateListTitle function takes the listId and newTitle as arguments and updates the list title in the database
    const updateListTitle = async (listId, newTitle) => {
        try {
            // Call the backend to update the list title
            const response = await axios.put(`http://127.0.0.1:5000/api/list/${listId}`, { name: newTitle });

            // Check if the list title was successfully updated
            if (response.status === 200) {
                const newList = lists.map(list => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            name: newTitle
                        };
                    }
                    return list;
                });
                setLists(newList);
            } else {
                console.error("Error updating list title:", response.data.error);
            }
        } catch (error) {
            console.error("An error occurred:", error.message);
            if (error.response && error.response.status === 401 && error.response.data.error === "Token has expired") {
                window.alert("Your token has expired. Please log in again.");
                navigate('/login');
            } else {
                window.alert("There was an issue updating the list title. Please try again.");
            }
        }
    };


    return (
        <div>

            <Header />
            <div className="container mx-auto px-4 py-8">

                {user ? (
                    <>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-start">
                                {lists.map((list, index) => (
                                    <Droppable key={list.id} droppableId={String(list.id)}>
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="flex justify-center min-w-full">
                                                <ToDoList
                                                    listId={list.id}
                                                    tasks={list.tasks.filter(task => !task.parent_id)}
                                                    listName={list.name}
                                                    createTask={createTask}
                                                    removeTask={removeTask}
                                                    removeList={() => removeList(list.id)}
                                                    updateListTitle={updateListTitle}
                                                />
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                ))}

                            </div>
                        </DragDropContext>

                        <div className="mt-8">
                            <button onClick={addNewList}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Add a new list
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center mt-20">
                        <p className="text-lg text-gray-700">Log in to start managing your todo lists</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;