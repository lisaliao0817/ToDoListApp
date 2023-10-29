import React, { useState, useContext } from 'react';
import ToDoList from '../components/ToDoList';
import Header from '../components/Header';
// add a feature that will allow users to drag a top-level task to another list. Its sublists should be moved as well
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';
import UserContext from '../UserContext';


const UserPage = () => {
    const [lists, setLists] = useState([]);
    const { user, setUser } = useContext(UserContext);

    const addNewList = async () => {
        const title = window.prompt("Enter the title for the new list:");
    
        if (title) {
            try {
                // Make a POST request to create a new list
                const response = await axios.post('http://127.0.0.1:5000/api/list', { name: title }, { withCredentials: true });
    
                if (response.data && response.data.id) {
                    setLists([...lists, { id: response.data.id, title: title, tasks: [] }]);
                } else {
                    window.alert("Error creating the list.");
                }
            } catch (error) {
                console.error("Error creating list:", error);
                window.alert("There was an issue creating the list. Please try again.");
            }
        }
    };
    
    
    
    const removeList = (listId) => {
        const newList = lists.filter(list => list.id !== listId);
        setLists(newList);
    };
    

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
                const response = await fetch(`/api/task/${taskToMove.id}/move/${destList.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        // Add authentication headers if necessary
                    },
                });
    
                const data = await response.json();
                if (response.status !== 200) {
                    throw new Error(data.error);
                }
            } catch (error) {
                console.error("Failed to move the task:", error);
                // You might want to handle this more gracefully in production,
                // such as showing a notification to the user, or reverting the drag-and-drop.
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



    const addTaskToList = (listId, title) => {
        if (!title || title.trim() === "") {
            window.alert("Task title cannot be empty!");
            return;
        }
    
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    tasks: [...list.tasks, { id: Date.now(), title: title.trim(), subtasks: [] }]
                };
            }
            return list;
        });
        setLists(newList);
    };
    
    // New function to remove a task from a specific list
    const removeTaskFromList = (listId, taskId) => {
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    tasks: list.tasks.filter(task => task.id !== taskId)
                };
            }
            return list;
        });
        setLists(newList);
    };



    const addSubTaskToTask = (listId, parentId, title) => {
        if (!title || title.trim() === "") {
            window.alert("Subtask title cannot be empty!");
            return;
        }
    
        const newTask = {
            id: Date.now(),
            title: title.trim(),
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
    
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    tasks: addSubTaskRecursive(list.tasks)
                };
            }
            return list;
        });
        setLists(newList);
    };
    
  
    const removeSubTaskFromTask = (listId, taskId) => {
        const removeSubTaskRecursive = (tasks) => {
            return tasks.filter(task => task.id !== taskId).map(task => ({
                ...task,
                subtasks: removeSubTaskRecursive(task.subtasks)
            }));
        };
  
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    tasks: removeSubTaskRecursive(list.tasks)
                };
            }
            return list;
        });
        setLists(newList);
    };
    
    const updateListTitle = (listId, newTitle) => {
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    title: newTitle
                };
            }
            return list;
        });
        setLists(newList);
    };
    
    return (
        <div>
            <Header />
    
            {/* Use a container with some horizontal padding and center everything */}
            <div className="container mx-auto px-4 py-8">


            {user ? (
                    <>
                {/* This will define a grid. Each list will try to fit in a 1/4 column, but will not shrink below its natural width */}
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
                                tasks={list.tasks} 
                                listName={list.title}
                                addTask={addTaskToList} 
                                removeTask={removeTaskFromList} 
                                removeList={() => removeList(list.id)}
                                updateListTitle={updateListTitle}
                                addSubTaskToTask={addSubTaskToTask} 
                                removeSubTaskFromTask={removeSubTaskFromTask}/>
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
                        <p className="text-lg text-gray-700">Log in to start creating your todo lists</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;
