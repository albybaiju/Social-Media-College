import React, { useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import "./navbar.css";


const Navbar = () => {



  return (
    <div className="navbarcomp">
      <div className="leftnav">
        <Link to="/User/" style={{textDecoration:"none" ,color:"black"}}>
          <span style={{ textDecoration: "none", fontSize: "20px" }}>
            {" "}
             /DConnect
          </span>
        </Link>
        <Link to="/User/">  <HomeIcon /></Link>
      
        <DarkModeIcon />
        <GridViewIcon />
        <div className="searchbar">
          <SearchIcon />
          <input type="text" placeholder="Search.." className="searchinput" />
        </div>
      </div>
      <div className="rightnav">
        <PersonIcon />
        <EmailIcon />
        <NotificationsIcon />

      </div>
    </div>
  );
};

export default Navbar;
