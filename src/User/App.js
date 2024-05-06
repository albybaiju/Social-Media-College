import React from "react";
import { Route, Routes } from "react-router-dom";
import "./Styleuapp.css";
import Home from "./Home/Home";
import Navbar from "./Components/Navbar/navbar";
import Sidebar from "./Components/Sidebar/sidebar";
import Rightbar from "./Components/Rightbar/rightbar";
import Clubuser from "./Clubs/Clubuser"
import Addpost from "./AddPost/Addpost";
import Myclubs from "./MyClub/MyClub"
import ClubPost from './ClubPost/ClubPost'
import Comments from "./Components/Comments/Comments";
import Profile from "./Components/Profile/Profile";
import EditProfile from "./Components/Editprofile/Editprofile";
import Settings from "./Components/Settings/Settings"
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import Notifications from "./Components/Notifications/Notifications"; 
import SingleClubJo from "./Clubs/SingleClubsJo";





const App = () => {
  return (
    <div>
        <div style={{display:"flex",marginLeft:"20px",justifyContent:"center"}}>
        <Sidebar  />
     
        <div style={{display:"flex",flexDirection:"column" }}>
        <Navbar />
       
          <div style={{ width:"751px",
    padding: "23px"}}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/Clubuser" element={<Clubuser/>}/>
              <Route path="/myclubs" element={<Myclubs/>}/>
              <Route path="/Addpost" element={< Addpost/>}/>
              <Route path="/ClubPost/:id" element={< ClubPost/>}/>
              <Route path="/Comments" element={<Comments/>}/>
              <Route path="/Profile/:id" element={<Profile/>}/>
              <Route path="/Editprofile/:id" element={<EditProfile/>}/>
              <Route path="/Settings" element={<Settings/>}/>
              <Route path="/ChangePassword" element={<ChangePassword/>}/>
              <Route path="/Notifications" element={<Notifications/>}/>
              <Route path="/SingleClubJo" element={<SingleClubJo/>}/>

             </Routes>
          </div>
          </div>
          <div style={{marginLeft:"0px"}}>
          <Rightbar/>
          </div>
        
      </div>
    </div>
  );
}

export default App

