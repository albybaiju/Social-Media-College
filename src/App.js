import React from 'react'
import {Routes,Route} from 'react-router-dom'
import District from './Admin/District'
import Place from './Admin/Place'
import Category from './Admin/Category'
import Subcategory from './Admin/Subcategory'




const App = () => {
  return (
    <div>
    <Routes>
          <Route path='/District' element={<District/>}/>
          <Route path='/Place' element={<Place/>}/>
          <Route path='/Category' element={<Category/>}/>
          <Route path='/Subcategory' element={<Subcategory/>}/>
    </Routes>
    </div>
        
  )
}

export default App
