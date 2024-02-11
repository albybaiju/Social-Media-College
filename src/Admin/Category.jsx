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

const Category = () => {
  const [category, setCategory] = useState("");
  const [showcategory, setShowCategory] = useState([]);
  const [check,setCheck] = useState('')


  const handleSubmit = async (c) => {
    c.preventDefault();

   if(check){
    const updateCategory = doc(db, "Category", check)
    await updateDoc(updateCategory,{ category })

   }
   else{
  
     await addDoc(collection(db, "Category"), { category });
     
   }


   
    setCategory("");
    fetchData();
    
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

  const deleteData = async (Id) => {
    await deleteDoc(doc(db, "Category", Id));
    fetchData();
    console.log(Id);
  };


  const getData = async (Id) =>{

    const DocRef = doc(db, "Category", Id);
    const DocSnap= (await getDoc(DocRef)).data()
    setCategory(DocSnap.category)
    setCheck(Id)
    
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box className="box" component="form" onSubmit={handleSubmit}>
    
      
        <Card className="card" elevation={3}>
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
        <Box sx={{ width: "100%" }}>
          <TableContainer component={Paper} sx={{ marginTop: 5  }} elevation={3}>
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
                        onClick={() => getData(row.Id)}
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
export default Category;
