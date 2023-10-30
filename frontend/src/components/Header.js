import { Link, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';
import UserContext from '../UserContext';
import axios from 'axios';

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();


  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');

    // Clear the JWT from Axios headers
    delete axios.defaults.headers.common['Authorization'];

    // Clear user from React context
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <h1 className="text-2xl font-bold text-indigo-800 mt-2">ToDo</h1>
            {/* <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" /> */}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-6">

          {/*
            if a user exits, show the user's email and a logout button
            if not, show a login button
          */}
          {user ? (
            <>
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </Link>
          )}
        </div>


      </nav>
    </header>
  )
};
