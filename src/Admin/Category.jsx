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

const Category = () => {
  const [category, setCategory] = useState("");
  const [showcategory, setShowCategory] = useState([]);
  const handleSubmit = async (c) => {
    c.preventDefault();
    const docRef = await addDoc(collection(db, "Category"), { category });
    setCategory("");
    fetchData();
    console.log(docRef);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      Id: doc.id,
      ...doc.data(),
    }));
    setShowCategory(querySnapshotData);
    console.log(querySnapshotData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box className="box" component="form" onSubmit={handleSubmit}>
      <Paper className="paper" elevation={3}>
        <Card className="card" elevation={4}>
          <div>
            <CardContent>
              <Typography
                variant="h2"
                sx={{ marginBottom: "50px !important", color: "purple" }}
              >
                Category
              </Typography>
              <Stack spacing={2} direction="column">
                <TextField
                  id="outlined-uncontrolled"
                  label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                />

                <Button variant="contained" color="secondary">
                  SAVE
                </Button>
              </Stack>
            </CardContent>
          </div>
        </Card>
        <Box sx={{ width: "60%" }}>
          <TableContainer component={Paper} sx={{ marginTop: 5 }} elevation={3}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sl.No</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {showcategory.map((row, key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row" align="center">
                      {key + 1}
                    </TableCell>
                    <TableCell align="center">{row.category}</TableCell>
                    <TableCell align="center">Delete</TableCell>
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
export default Category;
