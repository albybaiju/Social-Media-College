import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { Link, useParams } from "react-router-dom";
import { db, storage } from "../../../config/FireBase";
import SinglePost from "../SinglePost/SinglePost";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import styled from "@emotion/styled";
import AttachFileIcon from "@mui/icons-material/AttachFile";


const Profile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [editandpost, setEditandPost] = useState(false);
  const [posts, setPost] = useState([]);
  const [bio,setUserbio]= useState("")
  const [cover,setUsercover]= useState(null)
  const [photo,setUserphoto]= useState(null)
  const [caption, SetCaption] = useState("");
  const [photos, SetPhoto] = useState([]);

  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
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

  const fetchUserDetails = async () => {
    const uid = sessionStorage.getItem("uid");
    const userRef = doc(db, "users", id);
    const userData = (await getDoc(userRef)).data();
    setUsername(userData.user_name);
    setUserbio(userData.user_bio)
    setUserphoto(userData.user_profilepic)
    setUsercover(userData.user_coverpic)
    if (id === uid) {
      setEditandPost(true);
    } 
  };
  console.log(cover);
  console.log(photo);

  const fetchPost = async () => {
    const q = query(collection(db, "Posts"), where("user_id", "==", id));

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
          clubInfo: clubInfo,
          formattedTimeDifference: formattedTimeDifference,
        };
      })
      .filter((post) => !post.club_id);

    setPost(joinedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = sessionStorage.getItem("uid");

    const metadata = {
      contentType: "image/jpeg",
    }

   
   const uniqueFileName = generateUniqueFileName(uid, photos.name) 
    const storageRef = ref(storage, "images/" + uniqueFileName)
    await uploadBytesResumable(storageRef, photos, metadata)
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

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
    fetchUserDetails();
    fetchPost();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card sx={{ m: 1, objectFit: "cover", height: "500px" }}>
          <Box>
            
            <CardMedia
              image={cover}
              sx={{
                width: "836px",
                height: "310px",
                position: "relative",
              }}
            />
            <Avatar
              src={photo}
              alt=""
              sx={{
                position: "absolute",
                top: 340,
                left: 310,
                width: 130,
                height: 130,
                border: "3px solid white",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ mt: 10, ml: 6 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {username}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Typography>
                {bio}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ m: 3 }}>
              {editandpost && (
                <Link
                  to={`/User/Editprofile/${id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Button sx={{ borderRadius: "50px" }} variant="outlined">
                    EditProfile+
                  </Button>
                </Link>
              )}
            </Box>
          </Box>
        </Card>
        {editandpost ? 
        
        <Card
        sx={{
          m:1,
          height: "130px",
          borderRadius: "10px",
          display: "flex",
          justifyContent:"center"
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
      </Card> : <></>}
       
      </Box>
      <Box>
      <Box>
      {posts.map((row, key) => (
        <SinglePost props={row} key={key} fetchPost={fetchPost}/>
      ))}
    </Box>
    </Box>
    </Box>
  );
};

export default Profile;
