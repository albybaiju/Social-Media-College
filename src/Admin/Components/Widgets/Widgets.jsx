import React from "react";
import "./Widgets.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonIcon from "@mui/icons-material/Person";
const Widgets = ({ type }) => {
  let data;

  switch (type) {
    case "users":
      data = {
        title: "USERS",
        isMoney: false,
        link: "see all users",
        icon: <PersonIcon className="iconwid" sx={{color:'crimson', backgroundColor:'#F9C6C6'}} />,
      };
      break;

    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "see all orders",
        icon: <PersonIcon className="iconwid" sx={{color:'#F4EF35', backgroundColor:'#F5F39E'}} />,
      };

      break;

    case "earnings":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "see net earnings",
        icon: <PersonIcon className="iconwid" sx={{color:'#22EE46',backgroundColor:'#ACEEB7'}} />,
      };

      break;

    case "balance":
      data={
        title: "BALANCE",
        isMoney: true,
        link: "See details",
        icon: <PersonIcon className="iconwid" sx={{color:'#7850F8',backgroundColor:'#C2B3F4'}} />,
      };

      break;
      default:
      break;
  }
  return (
    <div className="wwidgets">
      <div className="left">
        <span className="titlew">{data.title}</span>
        <span className="counterw">{data.isMoney & "$"}</span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          20%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widgets;
