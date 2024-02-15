import React, { useEffect, useState } from "react";
import "./Style.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/FireBase";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";
const Place = () => {
  const [place, setPlace] = useState("");
  const [showplace, setShowPlace] = useState([]);
  const [check, setCheck] = useState("");
  const [showdistrict, setShowDistrict] = useState([]);
  const [district, setDistrict] = useState("");
  const [distr, setDistricts] = useState([]);


 

  const handleSubmit = async (a) => {
    a.preventDefault();
    console.log("hi");
    if (check) {
      const placeRef = doc(db, "Place", check);
      await updateDoc(placeRef, { place, district });
    } else {
      const msg = await addDoc(collection(db, "Place"), { place, district });
      console.log(msg);
    }

    setPlace("");
    fetchData();
  };

  // const fetchData = async () => {
  //   const querySnapshot = await getDocs(collection(db, "Place"));
  //   const querySnapshotData = querySnapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  //   setShowPlace(querySnapshotData);
  //   console.log(querySnapshotData);
  // };

  const fetchData = async () => {
    try {
      const placeSnapshot = await getDocs(collection(db, "Place"));
      const placeData = placeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const districtSnapshot = await getDocs(collection(db, "district"));
      const districtData = districtSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //  Perform inner join based on a common field (e.g., districtId)
      const joinedData = placeData
        .map((place) => ({
          ...place,
          districtInfo: districtData.find(
            (district) => district.id === place.district
          ),
        }))
        .filter((place) => place.districtInfo && place.districtInfo.district);

      setShowPlace(joinedData);

      const tets = districtData.map((dist) => ({
        ...dist,
        place: placeData.filter((place) => place.district === dist.id),
      }));
      console.log(tets);
      setDistricts(tets);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "Place", id));
    fetchData();
  };

  const updatePlace = async (id) => {
    const DocRef = doc(db, "Place", id);
    const DocSnap = (await getDoc(DocRef)).data();
    setPlace(DocSnap.place);
    setDistrict(DocSnap.district);
    setCheck(id);
  };

  const fetchDistrict = async () => {
    const querySnapshot = await getDocs(collection(db, "district"));
    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      Id: doc.id,
      ...doc.data(),
    }));
    setShowDistrict(querySnapshotData);
  };

  useEffect(() => {
    fetchData();
    fetchDistrict();
  }, []);

  return (
    <Box className="box" component="form" onSubmit={handleSubmit}>
      <Card elevation={2} className="card">
        <div>
          <Typography variant="h3" className="aad">
            Add Place
          </Typography>
          <CardContent>
            <Stack spacing={2} direction="column">
              <FormControl>
                <InputLabel id="demo-simple-select-label">District</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="District"
                  onChange={(e) => setDistrict(e.target.value) }
                  value={district}
                >
                  {showdistrict.map((row, key) => (
                    <MenuItem key={key} value={row.Id} >
                      {row.district}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic"
                label="place"
                variant="outlined"
                value={place}
                onChange={(event) => setPlace(event.target.value)}
              />
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Stack>
          </CardContent>
        </div>
      </Card>

      <Box sx={{ width: "100%" }}>
        <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
          <Table sx={{ minWidth: 600 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Sl.no</TableCell>
                <TableCell align="center"> Place</TableCell>
                <TableCell align="center"> District</TableCell>
                <TableCell align="center" colSpan="2">
                  Action
                </TableCell>
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
                  <TableCell align="center">
                    {row.districtInfo.district}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteData(row.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      startIcon={<UpdateIcon />}
                      onClick={() => updatePlace(row.id)}
                    >
                      Update
                    </Button>
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

export default Place;
