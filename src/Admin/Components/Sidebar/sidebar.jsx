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
import { Link } from "react-router-dom";

const Sidebar = () => {
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
            <Link className="li" to="#" style={{ textDecoration: "none", color: "black" }}>
              <DashboardIcon/>
              <span className="span">Dashboard</span>
            </Link>
          </li>
          <p className="titles">DATAS</p>
          <li className="li">
            <Link
            className="li"
              to="/Admin/district"
              style={{ textDecoration: "none", color: "black" }}
            >
              <AddLocationTwoToneIcon className="icons" />
              <span className="span">District</span>
            </Link>
          </li>
          <li className="li">
            <Link
            className="li"
              to="/Admin/Place"
              style={{ textDecoration: "none", color: "black" }}
            >
              <PlaceTwoToneIcon className="icons" />
              <span className="span">Place</span>
            </Link>
          </li>
          <li className="li">
            <Link
            className="li"
              to="/Admin/Category"
              style={{ textDecoration: "none", color: "black" }}
            >
              <CategoryTwoToneIcon className="icons" />
              <span className="span">Category</span>
            </Link>
          </li>
          <li className="li">
            <Link
            className="li"
              to="/Admin/Subcategory"
              style={{ textDecoration: "none", color: "black" }}
            >
              <CategoryTwoToneIcon className="icons" />
              <span className="span">SubCategory</span>
            </Link>
          </li>
          <p className="titles">USER</p>
          <li className="li">
            <NotificationsNoneTwoToneIcon className="icons" />
            <span className="span">Notifications</span>
          </li>
          <li className="li">
            <AccountCircleTwoToneIcon className="icons" />
            <span className="span">Profile</span>
          </li>
          <li className="li">
            <SettingsTwoToneIcon className="icons" />
            <span className="span">Settings</span>
          </li>
          <li className="li">
            <LogoutTwoToneIcon className="icons" />
            <span className="span">Logout</span>
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
