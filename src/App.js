import React from "react";
import { Routes, Route } from "react-router-dom";
import Admin from './Admin/App'
import User from './User/App'
import Guest from './Guest/App'
import './mainstyle.css'


const App = () => {
  return (
   
      <Routes>
       
        <Route path="/Admin/*" element={<Admin />} />
        <Route path="/User/*" element={<User />} />
        <Route path="/*" element={<Guest />} />
       
      </Routes>    
  )
}

export default App
