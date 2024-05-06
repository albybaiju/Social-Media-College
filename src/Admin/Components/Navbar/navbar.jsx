import React from "react";
import "./navbar.css";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="search">
         <img style={{width:165,height:60,marginLeft:450}} src="\Imags\dcccedog.png" alt="." />
        
        </div>
      </div>
    </div>
  );
};

export default Navbar;
