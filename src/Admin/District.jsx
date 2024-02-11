import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
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

import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

import "./Style.css";
import { db } from "../config/FireBase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const District = () => {
  const [district, setDistrict] = useState("");
  const [check, setCheck] = useState(null);
  const [showdistrict, setShowDistrict] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (check) {
      const washingtonRef = doc(db, "district", check);
      await updateDoc(washingtonRef, {
        district,
      });
    } else {
      await addDoc(collection(db, "district"), {
        district,
      });
    }
    setDistrict("");
    fetchData();
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

  const deleteData = async (Id) => {
    await deleteDoc(doc(db, "district", Id));
    fetchData();
  };

  const updateData = async (Id) => {
    const docRef = doc(db, "district", Id);
    const docSnap = (await getDoc(docRef)).data();
    setDistrict(docSnap.district);
    setCheck(Id);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box className="box" component="form" onSubmit={handleSubmit}>
        <Card className="card">
          <CardContent>
            <div>
              <Typography variant="h4">District</Typography>
              <Stack spacing={2} sx={{ mt: 4 }} direction="row">
                <TextField
                  id="outlined-basic"
                  label="district"
                  variant="outlined"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                />
                <Button variant="contained" type="submit" sx={{ px: 4 }}>
                  Save
                </Button>
              </Stack>
            </div>
          </CardContent>
        </Card>

        <Box sx={{ width: "100%" }}>
          <TableContainer component={Paper} sx={{ marginTop: 5 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sl.No</TableCell>
                  <TableCell align="center">District</TableCell>
                  <TableCell align="center" colSpan={2}>
                    Action
                  </TableCell>
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
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={() => deleteData(row.Id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="update"
                        color="primary"
                        onClick={() => updateData(row.Id)}
                      >
                        <UpdateIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default District;
