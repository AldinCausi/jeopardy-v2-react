import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './NotFoundPage.jsx';
import CreateBoardPage from './components/CreateBoardPage.jsx';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/host/create-board", element:<CreateBoardPage /> },
  { path: "*", element: <NotFoundPage /> }

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
