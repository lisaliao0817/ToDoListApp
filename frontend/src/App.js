import React from 'react';
import TodoList from './components/ToDoList';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
    return (
      <Router>
        <div className="App">
          <Routes>
            {/* ... other routes ... */}
            <Route path="/login" element={<LoginPage />} />
            {/* ... other routes ... */}
          </Routes>
        </div>
      </Router>
    );
}

export default App;



/*
function App() {
  return (
    <div className="App">
      <Header />
      <h1>Todo List App</h1>
      <TodoList />
    </div>
  );
}

export default App;
*/
