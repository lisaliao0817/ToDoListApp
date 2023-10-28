import React, { useState } from 'react';
import ToDoList from '../components/ToDoList';
import Header from '../components/Header';
// add a feature that will allow users to drag a top-level task to another list. Its sublists should be moved as well
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const UserPage = () => {
    const [lists, setLists] = useState([]);

    const addNewList = () => {
        setLists([...lists, { id: Date.now(), tasks: [] }]);
    };
    

    
    const handleOnDragEnd = (result) => {
        const { source, destination } = result;
        
        if (!destination) return;
    
        const newLists = [...lists];  // Create a shallow copy of lists
    
        if (source.droppableId === destination.droppableId) {
            // If within the same list, reorder tasks
            const sourceList = newLists.find(list => list.id === parseInt(source.droppableId));
            const [removed] = sourceList.tasks.splice(source.index, 1);
            sourceList.tasks.splice(destination.index, 0, removed);
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
        const newList = lists.map(list => {
            if (list.id === listId) {
                return {
                    ...list,
                    tasks: [...list.tasks, { id: Date.now(), title: title, subtasks: [] }]
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
    
    
    
    return (
        <div>
            <Header />
    
            {/* Use a container with some horizontal padding and center everything */}
            <div className="container mx-auto px-4 py-8">
    
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
                                <ToDoList listId={list.id} tasks={list.tasks} addTask={addTaskToList} removeTask={removeTaskFromList} 
                                addSubTaskToTask={addSubTaskToTask} removeSubTaskFromTask={removeSubTaskFromTask}/>
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                        ))}
                    </div>
                    </DragDropContext>
    
                <div className="mt-8">
                    {/* Button to add a new ToDoList */}
                    <button onClick={addNewList}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Add a new list
                    </button>
                </div>
            </div>
        </div>
    );
    
};

export default UserPage;
