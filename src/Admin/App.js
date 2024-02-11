import React from "react";
import { Routes, Route } from "react-router-dom";
import District from "./District";
import Place from "./Place";
import Category from "./Category";
import Subcategory from "./Subcategory";
import Sidebar from "./Components/Sidebar/sidebar";
import Navbar from "./Components/Navbar/navbar";
import './Styleapp.css'
import Club from "./Club";


const App = () => {
  return (
    <div className="adminbars ">
      <div>
      <Sidebar/>
      </div>
      <div>
        <Navbar/>
        <div className="routes">
        <Routes>
          <Route path="/District" element={<District/>}/>
          <Route path="/Place" element={<Place/>}/>
          <Route path="/Category" element={<Category/>}/>
          <Route path="/Subcategory" element={<Subcategory/>}/>
          <Route path="/Club" element={<Club/>}/>


        </Routes>
        </div>
      </div>
     
    </div>
   
  );
};

export default App;
