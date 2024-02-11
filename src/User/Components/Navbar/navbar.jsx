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
import { MenuItem, Popover, Select, Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
