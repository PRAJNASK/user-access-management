// filepath: c:\\Users\\PRAJNA SHETTY\\user-access-management\\user-access-management\\frontend\\src\\index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Reverted to import without .tsx extension
import './index.css'; // You can create this file for global styles

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
