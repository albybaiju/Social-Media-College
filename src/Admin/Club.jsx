import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Style.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../config/FireBase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Club = () => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [name, SetName] = useState("");
  const [category, SetCategory] = useState("");
  const [motto, SetMotto] = useState("");
  const [chairman, SetChairman] = useState("");
  const [photo, setPhoto] = useState([]);
  const [showcat, setShowCat] = useState([]);
  const [showusers, SetShowusers] = useState([]);
  const [admin, SetAdmin] = useState("");


  const fetchcat = async () => {
    const querycat = await getDocs(collection(db, "Category"));
    const quercatData = querycat.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setShowCat(quercatData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "images/" + photo.name);
    await uploadBytesResumable(storageRef, photo, metadata);
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

    const data = await addDoc(collection(db, "Clubs"), {
      club_name: name,
      club_motto: motto,
      club_photo: url,
      club_category: category,
       club_admin :admin,
      club_chairman: chairman,
    });
    console.log(data);

    SetName("");
    SetCategory("");
    SetMotto("");
    SetChairman("");
    setPhoto("");
    SetAdmin("")
  };

  const fetchUsers = async () => {
    const userSnapshot = await getDocs(collection(db, "users"));
    const userSnapshotData = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(userSnapshotData);
    SetShowusers(userSnapshotData);
  };

  useEffect(() => {
    fetchcat();
    fetchUsers();
  }, []);

  return (
    <Box className="box">
      <Card
        className="card-club"
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h3"
          sx={{ marginLeft: "90px", fontWeight: "bold" }}
        >
          Add Club
        </Typography>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <TextField
            id="standard-basic"
            label="Club Name"
            variant="standard"
            className="text-club"
            sx={{ width: "330px" }}
            value={name}
            onChange={(e) => SetName(e.target.value)}
          />
          <Stack spacing={4} direction="row">
            <FormControl variant="standard" sx={{width:"160px"}}>
              <InputLabel id="demo-simple-select-standard-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Category"
                value={category}
                onChange={(e) => SetCategory(e.target.value)}
              >
                {showcat.map((row, key) => (
                  <MenuItem key={key} value={row.id}>
                    {row.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ width: "130px" }}
              onChange={(e) => setPhoto(e.target.files[0])}
            >
              Photo
              <VisuallyHiddenInput type="file" />
            </Button>
          </Stack>
          <TextField
            id="standard-basic"
            label="Club Motto"
            variant="standard"
            className="text-club"
            sx={{ width: "330px" }}
            value={motto}
            onChange={(e) => SetMotto(e.target.value)}
          />

          <TextField
            id="standard-basic"
            label="Club Chairman"
            variant="standard"
            className="text-club"
            sx={{ width: "330px" }}
            value={chairman}
            onChange={(e) => SetChairman(e.target.value)}
          />

          <FormControl variant="standard" sx={{width:'330px'}}>
            <InputLabel id="demo-simple-select-standard-label">
              Admin
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              value={admin}
              onChange={(e)=>SetAdmin(e.target.value)}
            >
              {showusers.map((row, key) => (
                <MenuItem key={key} value={row.id}>
                  <Box sx={{display:'flex',alignItems:'center',gap:'10px',width:'98%',borderRadius:'30px'}}>
                  <AccountCircleIcon/>
                  {row.user_name}
                  </Box>
                 
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" sx={{ width: "90%" }} type="submit">
            SUBMIT
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Club;
