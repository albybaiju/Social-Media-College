import React from 'react';
import {Route,Routes} from 'react-router-dom'
import Login from './Login/Login';
import Register from './Registration/Register';
import SetProfileB from './SetProfileFirsttime/SetProfileB';
import Forgottpassword from './ForgottPassword/Forgottpassword';

function Gapp() {
  return (
    <div>
    <Routes>
      <Route path='/' element={<Login/>}/>
       <Route path='/Register' element={<Register/>}/>   
       <Route path='/SetProfileB' element={<SetProfileB/>}/>  
       <Route path='/Forgottpassword' element={<Forgottpassword/>}/>  
        

     

    </Routes>
    </div>
  );
}

export default Gapp;
