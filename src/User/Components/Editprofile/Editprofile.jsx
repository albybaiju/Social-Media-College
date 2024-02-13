import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { and, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../../../config/FireBase";
import { styled } from "@mui/material/styles";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import CircularProgress from "@mui/material/CircularProgress";



const EditProfile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [currPhoto, setcurrentPhoto] = useState("");
  const [currcover, setcurrentCoverPhoto] = useState("");
  const [loaderbut, setLoaderBut] = useState("");
  const [nopropic, setNoprofpic] = useState("");
  const [nocoverpic, setNocoverpic] = useState("");

  const selectPhoto = async (e) => {
    const photo = e.target.files[0];
    setPhoto(photo);
    const reader = new FileReader();
    reader.onload = function (e) {
      setcurrentPhoto(e.target.result);
    };
    reader.readAsDataURL(photo);
  };

  const selectCover = async (e) => {
    const coverphoto = e.target.files[0];
    setCoverPhoto(coverphoto);

    const reader = new FileReader();
    reader.onload = function (e) {
      setcurrentCoverPhoto(e.target.result);
    };
    reader.readAsDataURL(coverphoto);
  };

  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoaderBut(true);
    const uid = sessionStorage.getItem("uid");

    if (photo == 0 && coverPhoto !== 0) {
      const metadata = {
        contentType: "image/jpeg",
      };

      const uniqueFileName = generateUniqueFileName(uid, coverPhoto.name);
      const storageRef = ref(storage, "images/" + uniqueFileName);
      await uploadBytesResumable(storageRef, coverPhoto, metadata);
      const coverurl = await getDownloadURL(storageRef).then((downloadURL) => {
        return downloadURL;
      });

      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        user_name: username,
        user_bio: bio,
        user_coverpic: coverurl,
      });
      alert("Profile Updated");
    } else if (coverPhoto == 0 && photo !== 0) {
      const metadata = {
        contentType: "image/jpeg",
      };

      const uniqueFileName = generateUniqueFileName(uid, photo.name);
      const storageRef = ref(storage, "images/" + uniqueFileName);
      await uploadBytesResumable(storageRef, photo, metadata);
      const url = await getDownloadURL(storageRef).then((downloadURL) => {
        return downloadURL;
      });

      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        user_name: username,
        user_bio: bio,
        user_profilepic: url,
      });
      alert("Profile Updated");
    } else if (photo == 0 && coverPhoto == 0) {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        user_name: username,
        user_bio: bio,
      });
      alert("Profile Updated");
    } else {
      const metadata = {
        contentType: "image/jpeg",
      };

      const uniqueFileNamephoto = generateUniqueFileName(uid, photo.name);
      const storageReference = ref(storage, "images/" + uniqueFileNamephoto);
      await uploadBytesResumable(storageReference, photo, metadata);
      const url = await getDownloadURL(storageReference).then((downloadURL) => {
        return downloadURL;
      });

      const uniqueFileNameCover = generateUniqueFileName(uid, coverPhoto.name);
      const storageRef = ref(storage, "images/" + uniqueFileNameCover);
      await uploadBytesResumable(storageRef, coverPhoto, metadata);
      const coverurl = await getDownloadURL(storageRef).then((downloadURL) => {
        return downloadURL;
      });

      const userRef = doc(db, "users", id);
      await updateDoc(userRef, {
        user_name: username,
        user_bio: bio,
        user_profilepic: url,
        user_coverpic: coverurl,
      });
      alert("SuccessFully Updated");
    }

    setLoaderBut(false);
  };

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

  const userDetails = async () => {
    const fetchRef = doc(db, "users", id);
    const fetchData = (await getDoc(fetchRef)).data();

    // Check if the field is present in the document data
    const data = fetchData;
    const fieldname = "user_bio";
    if (fieldname in data) {
      setBio(fetchData.user_bio);
    } else {
      setBio("");
    }

    setUsername(fetchData.user_name);
    setcurrentCoverPhoto(fetchData.user_coverpic);
    setcurrentPhoto(fetchData.user_profilepic);

    // if(currPhoto == 0 && currcover == 0){
    //   console.log("NO Profile");
    // }
    // else if(currcover == 0 && currPhoto){
    //   console.log("no cover");
    // }
    // else if( currPhoto == 0 && currcover){
    //   console.log("NO propic");
    // }
  };

  useEffect(() => {
    userDetails();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {loaderbut && (
      <Box sx={{width:"150%"}}>      
        <LinearProgress/>
        </Box>
      )}

      <Box
        sx={{
          m: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          component="form"
          onSubmit={handleSubmit}
          sx={{ ml: 10, width: "600px", p: 2 }}
        >
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6">Profile Picture</Typography>
                <Box
                  sx={{
                    mb: 5,
                    width: "550px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={currPhoto}
                    sx={{ width: "130px", height: "130px" }}
                  />
                  <Button component="label" variant="contained">
                    Edit Profile Photo
                    <VisuallyHiddenInput type="file" onChange={selectPhoto} />
                  </Button>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6">Cover Photo</Typography>
                <Box
                  sx={{
                    width: "550px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CardMedia
                    image={currcover}
                    sx={{
                      width: "250px",
                      height: "150px",
                      backgroundColor: "lightgrey",
                    }}
                  />

                  <Button component="label" variant="contained">
                    Edit Cover Photo
                    <VisuallyHiddenInput type="file" onChange={selectCover} />
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 7 }}
              >
                <TextField
                  required
                  value={username}
                  label="Name"
                  variant="standard"
                  size="small"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="standard-multiline-flexible"
                  label="Bio"
                  multiline
                  maxRows={10}
                  variant="standard"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Add bio"
                />
              </Box>

              <Button
                variant="contained"
                type="submit"
                sx={{ mt: 2, ml: 25, width: "150px" }}
              >
              Update
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EditProfile;
