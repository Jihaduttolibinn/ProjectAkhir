import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Router>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={user ? <Dashboard /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/admin"
                        element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
                    />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
