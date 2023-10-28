import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import UserContext from '../UserContext';


export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {user ? (
            <span className="text-gray-700">{user.email}</span>
          ) : (
            <Link to="/loginsignup"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Log in
            </Link>
          )}
        </div>

        
      </nav>
    </header>
  )
}
