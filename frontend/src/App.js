import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserPage from './pages/UserPage';
import { UserProvider } from './UserContext';

function App() {
  const [user, setUser] = useState(null); // null means no user is logged in
  
  return (
    <UserProvider value={{ user, setUser }}>
      <Router>
        <div className="App">
          <Routes>
            {/* ... other routes ... */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<UserPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* ... other routes ... */}
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
