import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from "../../../config/FireBase";
import { styled } from "@mui/material/styles";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const EditProfile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [currPhoto, setcurrentPhoto] = useState();
  const [currcover, setcurrentCoverPhoto] = useState();

  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = sessionStorage.getItem("uid");

    if (photo == 0 && coverPhoto !== 0) {
      const metadata = {
        contentType: "image/jpeg",
      }

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
      alert("Profile Updated")
    }

    if (coverPhoto == 0 && photo !== 0) {
      const metadata = {
        contentType: "image/jpeg",
      }

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
      })
      alert("Profile Updated")
    }

    if (photo == 0 && coverPhoto == 0) {
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, {
          user_name: username,
          user_bio: bio,
        })
        alert("Profile Updated")   
    }

    if(photo !== 0 && coverPhoto !== 0){
      const metadata = {
        contentType: "image/jpeg",
      }
      
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
        user_coverpic:coverurl,
      })
      alert("SuccessFully Updated")
    }
       





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
    setUsername(fetchData.user_name);
    setBio(fetchData.user_bio);
    setcurrentPhoto(fetchData.user_profilepic);
    setcurrentCoverPhoto(fetchData.user_coverpic);
  };

  useEffect(() => {
    userDetails();
  }, []);

  return (
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
                <Button component="label" variant="contained">
                  Edit Profile
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
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
                <Button component="label" variant="contained">
                  Edit Profile
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(e) => setCoverPhoto(e.target.files[0])}
                  />
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
              Upload
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfile;
