import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LockResetIcon from '@mui/icons-material/LockReset';
import EditSharpIcon from '@mui/icons-material/EditSharp';

const Settings = () => {
  const uid=sessionStorage.getItem("uid")
  return (
    <Box>
      <Typography variant="h4" sx={{m:2}}>Settings</Typography>
      <Box>
        <TableContainer sx={{width:800,m:3}}>
          <Table  aria-label="simple table">


         
              <TableRow>
              <TableCell>
              <Link to={`/User/Editprofile/${uid}`} style={{textDecoration:'none',color:"black"}}>
                <Box sx={{display:"flex",alignItems:"center",gap:1}}>
                <EditSharpIcon/> 
                <Typography sx={{fontSize:16}}>Edit Profile</Typography>
                </Box>
                </Link>
                </TableCell>
              </TableRow>
            


            <TableHead>
              <TableRow>
                <TableCell >
                  <Link to="/User/ChangePassword" style={{textDecoration:"none",color:'black'}}>
                  <Box sx={{display:"flex",alignItems:"center",gap:1}}>
                  <LockResetIcon/>
                  <Typography sx={{fontSize:"17px"}}>
                    Change Password
                  </Typography>
                  </Box>
                  </Link>
                  </TableCell>
              </TableRow>
            </TableHead>


          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Settings;
