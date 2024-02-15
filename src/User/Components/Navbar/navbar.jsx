import React, { useState } from "react";
import NightsStayIcon from '@mui/icons-material/NightsStay';
import GridViewIcon from "@mui/icons-material/GridView";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import "./navbar.css";
import { Box, TextField, Typography } from "@mui/material";

const Navbar = () => {
  const [isactive, setActive] = useState(false);

  return (
    <Box className="navbarcomp">
      <Box className="leftnav">
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            /DConnect
          </Typography>
          <input
            type="text"
            placeholder="Search"
            onFocus={() => setActive(true)}
            onBlur={() => setActive(false)}
            style={{
              width: "210px",
              height: "40px",
              borderRadius: "20px",
              paddingLeft: 20,
              fontSize: 15,
              paddingRight: 40,
              border: "0.5px solid grey",
              borderColor: isactive ? "gray" : "lightgray",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
          />
          <SearchIcon sx={{position:"absolute",left:355}}/>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Link to="/User">
            <HomeIcon />
          </Link>

          <Link>
            <NotificationsIcon />
          </Link>

          <Link>
            <PersonIcon />
          </Link>
        </Box>
      </Box>

      <Box  className="rightnav">
        <NightsStayIcon/>
        <EmailIcon/>
        <GridViewIcon/>
   
      </Box>
    </Box>
  );
};

export default Navbar;
