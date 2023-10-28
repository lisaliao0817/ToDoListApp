import React, { useState } from 'react';
import ToDoList from '../components/ToDoList';
import Header from '../components/Header';

const UserPage = () => {
    const [lists, setLists] = useState([]);

    const addNewList = () => {
        setLists([...lists, { id: Date.now() }]);
    };

    return (
        <div>
            <Header />
    
            {/* Use a container with some horizontal padding and center everything */}
            <div className="container mx-auto px-4 py-8">
    
                {/* This will define a grid. Each list will try to fit in a 1/4 column, but will not shrink below its natural width */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-start">
                    {lists.map(list => (
                        <div key={list.id} className="flex justify-center w-full">
                            <ToDoList />
                        </div>
                    ))}
                </div>
    
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
