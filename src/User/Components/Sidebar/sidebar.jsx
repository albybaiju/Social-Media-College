import React, { useEffect, useState } from "react";
import "./sidebar.css";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Card, Typography,Modal } from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
import Groups3Icon from "@mui/icons-material/Groups3";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LogoutIcon from "@mui/icons-material/Logout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/FireBase";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import SinglePost from "../SinglePost/SinglePost";
import Addpost from "../../AddPost/Addpost"
const Sidebar = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 590,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  }

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [userProfile, setUserProfilePic] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const uid = sessionStorage.getItem("uid");

  const handleLogout = () => {
    sessionStorage.clear("uid");
    navigate("../../");
  };

  const userDetails = async () => {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db, "users", uid);
    const docSnap = (await getDoc(docRef)).data();
    setUsername(docSnap.user_name);
    setUserProfilePic(docSnap.user_profilepic);
  };

  useEffect(() => {
    userDetails();
  }, []);

  return (
    <Box className="leftbar">
      <Box sx={{ ml: 7, mt: 2 }}>
        <img
          style={{ width: "160px", height: "50px" }}
          src="\Imags\dcccedog.png"
        />
      </Box>
      <Box className="container" sx={{ mt: 3 }}>
        <div className="menu">
          <div className="user">
            <Avatar src={userProfile} />
            <span>{username}</span>
          </div>
        </div>
        <div className="menu">
          <Box className="item">
            <Link to="/User/MyClubs" className="menu-items">
              <Groups3Icon />
              <span style={{ fontSize: "16px" }}>MY CLUBS</span>
            </Link>
          </Box>

          <Box className="item">
            <Link to="/User/Clubuser/" className="menu-items">
              <GroupAddIcon />
              <span style={{ fontSize: "16px" }}> JOIN CLUBS</span>
            </Link>
          </Box>

          <div className="item">
            {/* <Link to="/User/Addpost" className="menu-items"> */}
              <AddAPhotoIcon />
              <Button onClick={handleOpen} sx={{ fontSize: "16px" }}><Typography sx={{color:'black'}}>Add Post</Typography></Button>
            {/* </Link> */}
          </div>

          <div className="item">
            <Link to={`/User/Profile/${uid}`} className="menu-items">
              <AccountCircleIcon />
              <Typography sx={{ fontSize: "16px" }}>MY PROFILE</Typography>
            </Link>
          </div>

          <Box className="item">
            <Link to="/User/Settings" className="menu-items">
              <SettingsIcon />
              <Typography sx={{ fontSize: "16px" }}>SETTINGS</Typography>
            </Link>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: 6 }}>
            <LogoutIcon />
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </div>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
          <Addpost/>
        </Box>
      </Modal>
    </Box>
  );
};

export default Sidebar;
