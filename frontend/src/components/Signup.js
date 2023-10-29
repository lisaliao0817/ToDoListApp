import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  


const Signup = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        window.alert("Passwords do not match!");
        return;
    }

    try {
        const response = await axios.post('http://127.0.0.1:5000/api/v1/signup', { 
            email: email, 
            password: password 
        });

        console.log('Signup successful:', response.data.message);

        // Maybe navigate to the login page or a dashboard after successful signup?
        navigate('/login');

    } catch (error) {
        console.error('Signup error:', error.response.data.message);
        
        // Check if the error is due to the email already existing
        if (error.response.data.message.includes("Email address already exists!")) { // Modify this condition based on your backend's error message
            window.alert("Email already exists!"); // Display alert to the user
        } else {
            // Handle other signup errors, e.g., showing a notification to the user
            // ... your other error handling logic here ...
        }
    }
};


const handleSigninClick = () => {
  navigate('/login'); 
};


    return (
        <div>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
             Sign Up
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
                <div className="flex items-center justify-between">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                        Confirm Password
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
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
                Sign up
              </button>
            </div>
          </form>

            <div className="mt-6">
            <p>
            Already have an account? <button onClick={handleSigninClick}>Sign in</button>
            </p>
            </div>
        </div>
        </div>
    );
};

export default Signup;