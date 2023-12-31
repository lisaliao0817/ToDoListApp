import axios from 'axios';
import UserContext from '../UserContext';
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);


  // This code handles the login form submission. 
  // It sends the user's email and password to the login endpoint and stores the response access_token in local storage.

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/login', {
        email: email,
        password: password
      });

      if (response.data && response.data.access_token) { // if login is successful  
        const token = response.data.access_token;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

        setUser({ email: email, token: token });  // set the user with both email and token after successful login

        // Store the token in localStorage for persistence
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userEmail', email);
      }

      console.log('Logged in successfully:', response.data.message);

      // Navigate to Userpage.js
      navigate('/');

    } catch (error) {
      console.error('Login error:', error.response?.data?.message);
      if (error.response?.data?.message.includes("Please check your login details and try again.")) {
        window.alert("Please check your login details and try again.");
      }
    }
  };


  const handleSignupClick = () => {
    navigate('/signup'); // This will navigate the user to the Sign Up page
  };

  return (
    <div>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign In
      </h2>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p>
            Don't have an account? <button onClick={handleSignupClick}>Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;