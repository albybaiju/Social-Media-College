import React, { useEffect } from "react";
import "./Widgets.css";
import {
  Box,Typography,Card
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonIcon from "@mui/icons-material/Person";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../config/FireBase";
import { useState } from "react";
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import { Link } from "react-router-dom";
const Widgets = () => {
  const[userscount,setUsersCount]=useState('')
  const[clubcount,setClubcount]=useState('')




  const fetchdatas = async() => {

    const coll = collection(db, "users");
    const snapshot = await getCountFromServer(coll);
    setUsersCount(snapshot.data().count)

    const clubs = collection(db, "Clubs");
    const Clubsnapshot = await getCountFromServer(clubs);
    setClubcount(Clubsnapshot.data().count)

  }
  useEffect(()=>{
    fetchdatas()

  },[])
  
return(
<div>
  <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:"50px"}}>
  
  {/* <div className="user-info-box">
      <h2>User Information</h2>
      <div className="user-stats">
        <div className="stat">
          <span className="label">Total Users:</span>
          <span className="value">{userscount}</span>
        </div>
      </div>
    </div> */}
    <Link to="/Admin/ManageUsers" style={{textDecoration:"none"}}>

    <Card sx={{ 
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      gap:2,
      borderRadius: 5,
    padding: 3,
    width: 300,
    margin: "20px auto",border:"2px solid #451952",
    transition: "background-color 0.3s ease", // Smooth transition for background color change
    "&:hover": {
      backgroundColor: "#DDF0F9" // Change background color to grey when hovered >
    }}}
    elevation={3}>
       

     <AssignmentIndOutlinedIcon style={{fontSize:"50px",color:"#451952"}}/>
      <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <Typography sx={{fontSize:"27px",fontWeight:"bolder"}}>{userscount}</Typography>
      <Typography sx={{fontSize:"20px"}}> Users </Typography>
      </Box>
  
    </Card>

    </Link>

<Link to="/Admin/ManageClubs " style={{textDecoration:"none"}}>
<Box sx={{ 
      display:"flex",
      justifyContent:"space-between",
      alignItems:"center",
      gap:2,
      borderRadius: 5,
    padding: 3,
    width: 300,
    margin: "20px auto",
    border:"2px solid #AE445A",
    transition: "background-color 0.3s ease", // Smooth transition for background color change
    "&:hover": {
      backgroundColor: "#E8BCB9" // Change background color to grey when hovered >
  
  }}}
     >
       

     <GroupsOutlinedIcon style={{fontSize:"50px",color:"#AE445A"}}/>
      <Box sx={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <Typography sx={{fontSize:"27px",fontWeight:"bolder"}}>{clubcount}</Typography>
      <Typography sx={{fontSize:"20px"}}> Clubs </Typography>
      </Box>
  
    </Box>
</Link>
    

    

  </div>

</div>
)  

};

export default Widgets;
