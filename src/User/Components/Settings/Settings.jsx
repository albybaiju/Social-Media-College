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

const Settings = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ml:1}}>Settings</Typography>
      <Box>
        <TableContainer sx={{width:800,m:2}}>
          <Table  aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell><Typography sx={{fontSize:16}}>Edit Profile</Typography></TableCell>
              </TableRow>
            </TableHead>


            <TableHead>
              <TableRow>
                <TableCell >
                  <Link to="/User/ChangePassword" style={{textDecoration:"none",color:'black'}}>
                  <Typography sx={{fontSize:16}}>Change Password</Typography>
                  </Link>
                  </TableCell>
              </TableRow>
            </TableHead>


            <TableHead>
              <TableRow>
                <TableCell><Typography sx={{fontSize:16}}>Others</Typography></TableCell>
              </TableRow>
            </TableHead>



       







          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Settings;
