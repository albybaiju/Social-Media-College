import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/FireBase";
import {
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  Box,
  Typography,
  Avatar,
  CardMedia,
  TableHead,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  const handleClick = (id) => {
    const uid = id;
    navigate(`/Admin/UserDetails/${uid}`);
  };

  const fetchUsers = async () => {
    const colRef = collection(db, "users");
    const users = await getDocs(colRef);
    const usersData = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort usersData alphabetically by name
    usersData.sort((a, b) => {
      const nameA = a.user_name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.user_name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    setUsers(usersData);
    console.log(usersData);
  };

  const handleDelete = async(id) =>{
          alert("Do you Want too delete this user")
          await deleteDoc(doc(db,"users",id))
          fetchUsers()
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <TableContainer sx={{ border: "1px solid ", width: 650, height: "400" }}>
        <Table
          sx={{ width: "650px", height: "400px", overflow: "scroll" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell style={{ borderRight: "1px solid grey" }}>
                Sl.no
              </TableCell>
              <TableCell
                align="center"
                style={{ fontWeight: "bold", fontSize: "16px" }}
              >
                Users
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row, key) => (
              <TableRow key={key}>
                <TableCell
                  sx={{ width: "10px", borderRight: "1px solid grey" }}
                >
                  {key + 1 + "."}
                </TableCell>
                <TableCell
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#E0E4E5",
                    },
                  }}
                >
                  <Box
                    sx={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Avatar src={row.user_profilepic} />
                      <Typography>{row.user_name}</Typography>
                    </Box>

                   <Box sx={{display:"flex",alignItems:"center",gap:1}}>
                   <Button
                      variant="contained"
                      onClick={() => handleClick(row.id)}
                    >
                      View User
                    </Button>
                    <Button variant="outlined" startIcon={<DeleteIcon />} onClick={()=>handleDelete(row.id)}>
                      Delete
                    </Button>
                   </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageUsers;
