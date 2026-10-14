import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Proactive Service Worker & Cache Storage Cleaner (Prevents stale bundles)
const APP_SW_VERSION = 'formclub_v2026_10_14_v10';
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    const currentVer = localStorage.getItem('formclub_sw_ver');
    if (currentVer !== APP_SW_VERSION) {
      localStorage.setItem('formclub_sw_ver', APP_SW_VERSION);
      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            if (!key.includes(APP_SW_VERSION)) caches.delete(key);
          });
        });
      }
    }
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.update());
    });
  } catch (err) {}
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Toaster position="top-right" theme="dark" toastOptions={{
        style: {
          background: '#1F2937',
          color: '#F9FAFB',
        }
      }} />
    </HashRouter>
  </React.StrictMode>,
)
