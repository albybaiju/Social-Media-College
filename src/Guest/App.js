import React from 'react';
import {Route,Routes} from 'react-router-dom'
import Login from './Login/Login';
import Register from './Registration/Register';

function Gapp() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Login/>}/>
       <Route path='/Register' element={<Register/>}/>   
     

    </Routes>
    </div>
  );
}

export default Gapp;
