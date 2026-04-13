import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        if (process.env.NODE_ENV === 'production') {
            navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                console.log('Service Worker registered:', registration);
            }).catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
            return;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
