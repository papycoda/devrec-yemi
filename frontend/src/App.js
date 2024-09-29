import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/projects" element={<ProjectList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

