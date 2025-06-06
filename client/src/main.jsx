import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home';
import Depenses from './pages/Depenses';
import Tags from './pages/Tags';
import Analytics from './pages/Analytics';
import './index.css';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,  // App est le layout global
      children: [
        { index: true, element: <Home /> },        // équivalent "/"
        { path: 'depenses', element: <Depenses /> },
        { path: 'tags', element: <Tags /> },
        { path: 'analytics', element: <Analytics /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
