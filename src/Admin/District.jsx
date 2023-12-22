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
import { db } from "../config/FireBase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const District = () => {
  const [district, setDistrict] = useState("");
  const [showdistrict, setShowDistrict] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "district"), {
      district,
    });
    setDistrict("");
    fetchData();
    console.log(docRef);
  };

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "district"));
    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      Id: doc.id,
      ...doc.data(),
    }));
    setShowDistrict(querySnapshotData);
    console.log(querySnapshotData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box className="box" component="form" onSubmit={handleSubmit}>
        <Paper className="paper">
          <Card className="card">
            <CardContent>
              <div>
                <Typography variant="h3">District</Typography>
                <Stack spacing={2} direction="row">
                  <TextField
                    id="outlined-basic"
                    label="district"
                    variant="outlined"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                  />
                  <Button variant="contained" type="submit">
                    Save
                  </Button>
                </Stack>
              </div>
            </CardContent>
          </Card>

          <Box sx={{ width: "60%" }}>
            <TableContainer component={Paper} sx={{ marginTop: 5 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sl.No</TableCell>
                    <TableCell align="center">District</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showdistrict.map((row, key) => (
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      key={key}
                    >
                      <TableCell component="th" scope="row">
                        {key + 1}
                      </TableCell>
                      <TableCell align="center">{row.district}</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default District;
