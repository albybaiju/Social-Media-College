import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/FireBase";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";

const Subcategory = () => {
  const [subcategory, setSubCategory] = useState("");
  const [showsubcategory, setShowSubCategory] = useState([]);
  const [check, setCheck] = useState("");
  const [showcategory, setShowCategory] = useState([]);
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (check) {
      const updateSubcategory = doc(db, "SubCategory", check);
      await updateDoc(updateSubcategory, { subcategory, category });
    } else {
      await addDoc(collection(db, "SubCategory"), {
        subcategory,
        category,
      });
    }

    setSubCategory("");
    fetchjoin();
  };

  const fetchjoin = async () => {
    try {
      const catQuerySnapshot = await getDocs(collection(db, "Category"));
      const catData = catQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const subcatsnapshot = await getDocs(collection(db, "SubCategory"));
      const subcatData = subcatsnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const joinData = subcatData
        .map((subcategory) => ({
          ...subcategory,
          CategoryInfo: catData.find(
            (category) => category.id === subcategory.category
          ),
        }))
        .filter(
          (subcategory) => subcategory.CategoryInfo && subcategory.CategoryInfo.category
        )
      setShowSubCategory(joinData)
    } 
    catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchCategory = async () => {
    const DataSnapshot = await getDocs(collection(db, "Category"));
    const CategorySnapshotData = DataSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setShowCategory(CategorySnapshotData);
    console.log(CategorySnapshotData);
  };

  

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "SubCategory", id));
    fetchjoin();
  };

  const updateData = async (id) => {
    const DocRef = doc(db, "SubCategory", id);
    const DocSnap = (await getDoc(DocRef)).data();
    setSubCategory(DocSnap.subcategory);
    setCheck(id);
  };

  useEffect(() => {
    fetchjoin();
    fetchCategory();
  }, []);

  return (
    <Box className="box" component="form" onSubmit={handleSubmit}>
        <Card className="card">
          <CardContent>
            <div>
              <Typography variant="h4">Subcategory</Typography>
              <Stack spacing={1} direction="column">
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  {showcategory.map((cat, key) => (
                    <MenuItem key={key} value={cat.id}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </Select>
                <TextField
                  id="outlined-basic"
                  label="place"
                  variant="outlined"
                  value={subcategory}
                  onChange={(event) => setSubCategory(event.target.value)}
                />
                <Button variant="contained" type="Submit">
                  SAVE
                </Button>
              </Stack>
            </div>
          </CardContent>
        </Card>

        <Box sx={{ width: "100%" }} className="box">
          <TableContainer component={Paper} sx={{ marginTop: 5 }} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="tablerow">
                  <TableCell>Sl.no</TableCell>
                  <TableCell align="center">Subcategory</TableCell>
                  <TableCell align="center">Category</TableCell>

                  <TableCell align="center" colSpan={2}>
                    Action
                  </TableCell>
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
                    <TableCell align="center">
                      {row.CategoryInfo.category}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        onClick={() => deleteData(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        onClick={() => updateData(row.id)}
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
  );
};

export default Subcategory;
