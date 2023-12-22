import React, { useEffect, useState } from "react";
import "./Style.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/FireBase";

const Place = () => {
  const [place, setPlace] = useState("");
  const [showplace, setShowPlace] = useState([]);

  const handleSubmit = async (a) => {
    a.preventDefault();
    const docRef = await addDoc(collection(db, "Place"), {
      place,
    });
    setPlace("");
    fetchData();
    console.log(docRef);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "Place"));
    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setShowPlace(querySnapshotData);
    console.log(querySnapshotData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex" }} component="form" onSubmit={handleSubmit}>
      <Paper
        elevation={3}
        className="paper"
        sx={{ backgroundColor: "#F4E3DE" }}
      >
        <Card
          elevation={2}
          className="card"
          sx={{ backgroundColor: "#FFD2C3" }}
        >
          <div>
            <Typography variant="h3" className="aad">
              Add Place
            </Typography>
            <CardContent>
              <Stack spacing={2} direction="column">
                <TextField
                  id="outlined-basic"
                  label="place"
                  variant="outlined"
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                />
                <Button variant="contained">Save</Button>
              </Stack>
            </CardContent>
          </div>
        </Card>

        <Box sx={{ width: "50%" }}>
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
            <Table sx={{ minWidth: 600 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="ceneter">Sl.no</TableCell>
                  <TableCell align="center"> Place</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showplace.map((row, key) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={key}
                  >
                    <TableCell component="th" scope="row">
                      {key + 1}
                    </TableCell>
                    <TableCell align="center">{row.place}</TableCell>
                    <TableCell align="center">delete</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default Place;
