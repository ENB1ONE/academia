import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

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
