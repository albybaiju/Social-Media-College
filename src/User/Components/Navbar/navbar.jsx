import React, { useState } from "react";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import "./navbar.css";
import { Box,Card } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ExploreIcon from '@mui/icons-material/Explore';


import Input from '@mui/material/Input';

const Navbar = () => {
 
  const ariaLabel = { 'aria-label': 'description' };



  

  const location = useLocation();
  const uid = sessionStorage.getItem("uid");
  
  return (
 
<Box sx={{position:"sticky",top:0,zIndex:999,background:"white",width:"100%"}}>
  <Box sx={{width:"100%",height:"45px",borderBottom:"1px solid #E0DFDE",display:"flex",justifyContent:"center",alignItems:"center"}}>
  <Box sx={{ml:"-5px",display: "flex",gap:20}}>
          <Link to="/User" >
            {location.pathname === "/User" ? (
              <HomeIcon  sx={{fontSize:"25px",color:"black"}}/>
            ) : (
              <HomeOutlinedIcon sx={{fontSize:"25px",color:"black"}} />
            )}
          </Link>
          
          <Link to="/User/Notifications">
            {location.pathname === "/User/Notifications" ? (
              <NotificationsIcon sx={{fontSize:"25px",color:"black"}} />
            ) : (
              <NotificationsNoneOutlinedIcon sx={{fontSize:"25px",color:"black"}} />
            )}
          </Link>

          <Link to={`/User/Profile/${uid}`}>
            {location.pathname === `/User/Profile/${uid}` ? (
              <PersonIcon sx={{fontSize:"25px",color:"black"}} />
            ) : (
              <PersonOutlineOutlinedIcon sx={{fontSize:"25px",color:"black"}} />
            )}
          </Link>
        </Box>
      

  </Box>
</Box>

  );
};

export default Navbar;
