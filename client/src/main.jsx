import React from 'react';
import { createRoot } from 'react-dom/client'; 
import { BrowserRouter } from 'react-router-dom'; 
import 'react-datepicker/dist/react-datepicker.css';
import App from './App.jsx';
import './index.css';



// Utilisez createRoot au lieu de ReactDOM.createRoot
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);