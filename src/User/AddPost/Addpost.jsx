import {
  Avatar,
  Box,
  Button,
  Card,
  IconButton,
  Input,
  InputAdornment,
} from "@mui/material";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import SendIcon from "@mui/icons-material/Send";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../config/FireBase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SinglePost from "../Components/SinglePost/SinglePost";
const Addpost = () => {
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

  const [caption, SetCaption] = useState("");
  const [photo, SetPhoto] = useState([]);
  const [posts, SetPost] = useState([]);
  
  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
  };

  const fetchPost = async () => {
    const uid = sessionStorage.getItem("uid");

    const q = query(collection(db, "Posts"), where("user_id", "==", uid));

    const querySnapshot = await getDocs(q);
    const qData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    const user = await getDocs(collection(db, "users"));
    const userData = user.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const joinedData = qData
      .map((post) => {
        const userInfo = userData.find((user) => user.id === post.user_id);
        const clubInfo = "";

        // Calculate time difference
        const currentTime = new Date();
        const uploadedTime = post.post_time.toDate(); // Assuming 'timestamp' is the field storing the upload time

        const timeDifferenceInMillis = currentTime - uploadedTime;

        // Convert the time difference to a readable format
        const secondsDifference = Math.floor(timeDifferenceInMillis / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        let formattedTimeDifference;

        if (daysDifference >= 7) {
          // If more than 7 days, show only the date
          formattedTimeDifference = uploadedTime.toDateString();
        } else if (hoursDifference >= 24) {
          // If more than 24 hours, show only in days
          formattedTimeDifference = `${daysDifference}d ago`;
        } else if (minutesDifference >= 60) {
          // If more than 60 minutes, show only in hours
          formattedTimeDifference = `${hoursDifference}h ago`;
        } else if (secondsDifference >= 60) {
          // If more than 60 seconds, show only in minutes
          formattedTimeDifference = `${minutesDifference} minutes ago`;
        } else {
          formattedTimeDifference = `${secondsDifference}s ago`;
        }

        // Add the formatted time difference to the post object
        return {
          ...post,
          userInfo: userInfo,
          clubInfo:clubInfo,
          formattedTimeDifference: formattedTimeDifference,
        };
      })
      .filter((post) => !post.club_id);

    SetPost(joinedData);
    console.log(joinedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = sessionStorage.getItem("uid");

    const metadata = {
      contentType: "image/jpeg",
    }
    
    const uniqueFileName = generateUniqueFileName(uid , photo.name)
    const storageRef = ref(storage, "images/" + uniqueFileName);
    await uploadBytesResumable(storageRef, photo, metadata)
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

    console.log(url);
    const timestamp = serverTimestamp();

    await addDoc(collection(db, "Posts"), {
      post_caption: caption,
      post_photo: url,
      user_id: uid,
      post_time: timestamp,
    });

    SetPhoto("");
    SetCaption("");
    fetchPost();
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 10,
        }}
      >
        <Card
          sx={{
            height: "130px",
            borderRadius: "10px",
            display: "flex",
          }}
          elevation={3}
        >
          <Box
            sx={{
              m: 5,
              ml: 10,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            component="form"
            onSubmit={handleSubmit}
          >
            <Box>
              <Avatar src="" alt="" />
            </Box>

            <Box
              sx={{
                width: "420px",
                minHeight: "30px",
                border: "1px solid",
                pl: 4,
                pt: 1,
                pb: 1,
                p: 2,
                borderRadius: "50px",
              }}
            >
              <Input
                onChange={(e) => SetCaption(e.target.value)}
                placeholder="whats on your mind"
                value={caption}
                sx={{ width: "390px", border: "none", ml: "10px" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      component="label"
                      onChange={(e) => SetPhoto(e.target.files[0])}
                    >
                      <AttachFileIcon />
                      <VisuallyHiddenInput type="file" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Box>

            <Button variant="contained" endIcon={<SendIcon />} type="submit">
              POST
            </Button>
          </Box>
        </Card>
      </Box>
      <Box>
      {posts.map((row, key) => (
        <SinglePost props={row} key={key} fetchPost={fetchPost} />
      ))}
    </Box>
    </Box>
  );
};

export default Addpost;
