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
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SinglePost from "../Components/SinglePost/SinglePost";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import AddAPhotoOutlinedIcon from "@mui/icons-material/AddAPhotoOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CircularProgress from '@mui/material/CircularProgress';
import Home from "../Home/Home";
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
  const [userpic, SetUserPic] = useState("");
  const [loading, setLoading] = useState("");


  const fetchUser = async() =>{

const uid = sessionStorage.getItem('uid')

const userRef = doc(db,"users",uid)
const userData= (await getDoc(userRef)).data()
SetUserPic(userData.user_profilepic)


  }



  const fetchPosts = async () => {
    const uid = sessionStorage.getItem("uid");

    const q = query(collection(db, "Posts"), where("user_id", "==", uid),orderBy("post_time","desc"));

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

    SetPost(joinedData);
    console.log(joinedData);
  };

  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    const uid = sessionStorage.getItem("uid");
    setLoading(true)

    if(photo != ""){

      const metadata = {
        contentType: "image/jpeg",
      };
  
      const uniqueFileName = generateUniqueFileName(uid, photo.name);
      const storageRef = ref(storage, "images/" + uniqueFileName);
      await uploadBytesResumable(storageRef, photo, metadata);
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
      fetchPosts();
    }

    else{
      const timestamp = serverTimestamp();
      await addDoc(collection(db, "Posts"), {
        post_caption: caption,
        user_id: uid,
        post_time: timestamp,
      });
      SetCaption("");
      fetchPosts();
    }
    alert("Post Uploaded!")
    setLoading(false)
      
  };

  useEffect(() => {
    fetchPosts();
    fetchUser()
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
            <Card
             component="form"
             onSubmit={handleSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "4px",
                height: 100,
                width: 717,
                p: 1,
              }}
            >
              <Box>
                <Avatar src={userpic} alt="" sx={{width:50,height:50}} />
              </Box>

              <Box
                sx={{
                  width: "400px",
                  minHeight: "30px",
                  borderRadius: "25px",
                  pl: 3,
                  pr: 3,
                  pb: 1,
                  pt: 2,
                  backgroundColor: "#EAEAEA",
                  position: "relative",
                }}
              >
                <Input
                  onChange={(e) => SetCaption(e.target.value)}
                  placeholder="whats on your mind..."
                  value={caption}
                  sx={{ width: "398px", border: "none" }}
                  endAdornment={
                    <label htmlFor="upload-photo">
                      <CameraAltOutlinedIcon
                        sx={{
                          cursor: "pointer",
                          border: "1px solid",
                          padding: 0.5,
                          borderRadius: "10px",
                          transition: "background-color 0.3s ease",
                          "&:hover": {
                            backgroundColor: "#DEDADA"
                          }
                        }}
                      />
                
                      <input
                        id="upload-photo"
                        type="file"
                        onChange={(e) => SetPhoto(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                    </label>
                  }
                />
              </Box>
          
    
            <Button variant="contained" type="submit">
            {loading ? <CircularProgress sx={{width:40,height:40}}/> :"POST"}  
          </Button>
            
      
             
              {/* <label htmlFor="upload-photo">
            
                <CameraAltOutlinedIcon
                  sx={{ position: "absolute",top:73, right: 199,cursor:"pointer",border:"1px solid",padding:0.5,borderRadius:"10px",
                
                  transition: "background-color 0.3s ease", // Smooth transition for background color change
                  "&:hover": {
                    backgroundColor: "#DEDADA" // Change background color to grey when hovered >
                
                
                }}}
                /> */}

               
                {/* <input
                  id="upload-photo"
                  type="file"
                  onChange={(e) => SetPhoto(e.target.files[0])}
                  style={{ display: "none" }} // Hide the input element
                />
              </label> */}
            </Card>
          </Box>
      </Box>
      
  
  );
};

export default Addpost;
