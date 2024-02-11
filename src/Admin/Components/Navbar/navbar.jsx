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
          <input type="text" placeholder="Search..."  className="barnav"/>
          <SearchIcon  />
        </div>
        <div className="items">
          <div className="item">
            <LanguageIcon className="iconad" />
            English
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="iconad" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <NotificationsOutlinedIcon className="iconad" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="iconad" />
          </div>
          <div className="item">
          <AccountCircleIcon className="iconad"/> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
