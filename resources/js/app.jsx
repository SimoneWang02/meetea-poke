import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Ordina from './pages/Ordina';
import OrdineConfermato from './pages/OrdineConfermato';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import { MenuProvider } from './lib/MenuProvider';

function App() {
    return (
        <MenuProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ordina" element={<Ordina />} />
                    <Route path="/ordina/conferma" element={<OrdineConfermato />} />
                    <Route path="/staff" element={<Admin />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </MenuProvider>
    );
}

const container = document.getElementById('app');
createRoot(container).render(<App />);
