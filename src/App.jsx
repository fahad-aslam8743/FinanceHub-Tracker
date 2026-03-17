import React from 'react'
import { BrowserRouter, Navigate, Route,Routes} from 'react-router-dom'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import ProtectedRoute from './Components/ProtectedRoute'
import Dashboard from './Pages/Dashboard'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#000000',
          },
        }} 
      />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
