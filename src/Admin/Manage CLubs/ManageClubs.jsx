import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
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
import { db } from "../../config/FireBase";

const ManageClubs = () => {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate()

  const fetchClubs = async () => {
    const colRef = collection(db, "Clubs");
    const clubs = await getDocs(colRef);
    const clubsData = clubs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Sort usersData alphabetically by name
    clubsData.sort((a, b) => {
      const nameA = a.club_name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.club_name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    setClubs(clubsData);
    console.log(clubsData);
  };

  const handleClick = (id) => {
    const uid = id;
    navigate(`/Admin/ClubView/${uid}`)
    
  };

  const handleDelete = async(id) =>{
          alert("Do you Want too delete this Club")
          await deleteDoc(doc(db,"Clubs",id))
          fetchClubs()
  }

  useEffect(() => {
    fetchClubs();
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
                Clubs
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clubs.map((row, key) => (
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
                      <Avatar src={row.club_photo} />
                      <Typography>{row.club_name}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                    <Button
                      variant="contained"
                      onClick={() => handleClick(row.id)}
                    >
                      View Club
                    </Button>      
                      
                      <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(row.id)}
                      >
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

export default ManageClubs;
