import React, { useEffect, useState } from "react";
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
import "./Style.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/FireBase";


const Subcategory = () => {
  const [subcategory, setSubCategory] = useState("");
  const [showsubcategory, setShowSubCategory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Sec = await addDoc(collection(db, "SubCategory"), {
      subcategory,
    });
    setSubCategory("");
    fetchData();
    console.log(Sec);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "SubCategory"));
    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setShowSubCategory(querySnapshotData);
    console.log(querySnapshotData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box className="Box" component="form" onSubmit={handleSubmit}>
      <Paper className="paper" elevation={3}>
        <Card className="card">
          <CardContent>
            <div>
              <Typography variant="h4">Subcategory</Typography>
              <Stack spacing={1} direction="row">
                <TextField
                  id="outlined-basic"
                  label="place"
                  variant="outlined"
                  value={subcategory}
                  onChange={(event) => setSubCategory(event.target.value)}
                />
                <Button variant="contained" type="Submit">SAVE</Button>
              </Stack>
            </div>
          </CardContent>
        </Card>

        <Box sx={{ width: "60%" }}>
          <TableContainer component={Paper} sx={{ marginTop: 5 }} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="tablerow">
                  <TableCell>Sl.no</TableCell>
                  <TableCell align="center">Subcategory</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showsubcategory.map((row, key) => (
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    key={key}
                  >
                    <TableCell component="th" scope="row">
                      {key + 1}{" "}
                    </TableCell>
                    <TableCell align="center">{row.subcategory}</TableCell>
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

export default Subcategory;
