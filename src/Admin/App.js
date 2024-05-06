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
import AddSections from "./AddSections";
import Widgets from "./Widgets/Widgets";
import ManageUsers from "./Manage Users/ManageUsers";
import ManageClubs from "./Manage CLubs/ManageClubs";
import UserDetails from "./UserDetails/UserDetails";
import SinglePostAd from "./SinglePostAd";
import ClubView from "./Manage CLubs/ClubView";

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
           <Route path="/" element={<Widgets/>}/>
          <Route path="/District" element={<District/>}/>
          <Route path="/Place" element={<Place/>}/>
          <Route path="/Category" element={<Category/>}/>
          <Route path="/Subcategory" element={<Subcategory/>}/>
          <Route path="/Club" element={<Club/>}/>
          <Route path="/AddSections" element={<AddSections/>}/>
          <Route path="/ManageUsers" element={<ManageUsers/>}/>
          <Route path="/ManageClubs" element={<ManageClubs/>}/>
          <Route path="/UserDetails/:id" element={<UserDetails/>}/>
          <Route path="/SinglePostAd" element={<SinglePostAd/>}/>
          <Route path="/ClubView/:id" element={<ClubView/>}/>




        </Routes>
        </div>
      </div>
     
    </div>
   
  );
};

export default App;
