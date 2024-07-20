import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';


import App from './App.jsx'
import './index.css'
import Landing from './Landing.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
        <Landing></Landing>
    ),
  },
  {
    path: '/login',
    element: (
        <Login></Login>
    ),
  },
  {
    path: '/signup',
    element: (
        <Signup></Signup>
    ),
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
)
