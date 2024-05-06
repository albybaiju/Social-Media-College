import React from "react";
import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryTwoToneIcon from "@mui/icons-material/CategoryTwoTone";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import PlaceTwoToneIcon from "@mui/icons-material/PlaceTwoTone";
import AddLocationTwoToneIcon from "@mui/icons-material/AddLocationTwoTone";
import { Link,useNavigate } from "react-router-dom";
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import {
  Button,
} from "@mui/material";
const Sidebar = () => {
  
  const navigate = useNavigate()
  const handleLogout = () =>{
    sessionStorage.clear('aid')
   navigate("../../../")
}
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">Admin</span>
      </div>
      <hr />
      <div className="center">
        <ul className="ul">
          <p className="titles">MAIN</p>
          <li className="li">
            <Link className="li" to="/Admin" style={{ textDecoration: "none", color: "black" }}>
              <DashboardIcon/>
              <span className="span">Dashboard</span>
            </Link>
          </li>
          <p className="titles">DATAS</p>
  
 
          <li className="li">
            <Link
            className="li"
              to="/Admin/ManageClubs"
              style={{ textDecoration: "none", color: "black" }}
            >
              <CategoryTwoToneIcon className="icons" />
              <span className="span">Manage Clubs</span>
            </Link>
          </li> 
          
          <li className="li">
            <Link
            className="li"
              to="/Admin/ManageUsers"
              style={{ textDecoration: "none", color: "black"}}
            >
              <CategoryTwoToneIcon className="icons" />
              <span className="span">Manage Users</span>
            </Link>
          </li> 
         

          <li className="li">
            <Link
            className="li"
              to="/Admin/Club"
              style={{ textDecoration: "none", color: "black" }}
            >
              <GroupsTwoToneIcon className="icons" />
              <span className="span">Add Clubs</span>
            </Link>
          </li>
          <li className="li">
      

            <LogoutTwoToneIcon className="icons" />
            <Button variant="outlined"  onClick={handleLogout} >Logout</Button>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="coloroption"></div>
        <div className="coloroption"></div>
      </div>
    </div>
  );
};

export default Sidebar;
