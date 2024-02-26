import React from 'react'

// importing Routes from react-router package
import { Routes, Route } from 'react-router'

// importing the components
import Landing from './pages/Landing/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ToDoList from './pages/ToDo/ToDoList'

import './App.css';

// importing styling from ant design
import 'antd/dist/reset.css'

function App() {
  return (
    // creating a routes in react which will then call the specific component of that route
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/to-do-list' element={<ToDoList />} />
    </Routes>
  )
}

export default App