import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ordina from './pages/Ordina';
import Admin from './pages/Admin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/ordina" element={<Ordina />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

const container = document.getElementById('app');
createRoot(container).render(<App />);
