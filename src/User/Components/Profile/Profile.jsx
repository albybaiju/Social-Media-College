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
  orderBy,
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
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";



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

  const fetchPost = async () => {
    const q = query(collection(db, "Posts"), where("user_id", "==", id),orderBy("post_time","desc"));

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
    const uid= sessionStorage.getItem('uid')

    if(photos != ""){
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
      fetchPost();
    }

    else{
      const timestamp = serverTimestamp();
      await addDoc(collection(db, "Posts"), {
        post_caption: caption,
        user_id: uid,
        post_time: timestamp,
      });
      SetCaption("");
      fetchPost();
   
    }
  };


  useEffect(() => {
    fetchUserDetails();
    fetchPost();
  }, []);

  return (
    <Box sx={{    width: "786px",
      marginLeft: "-17px",
      marginTop: "-14px"}}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card sx={{ m: 1, objectFit: "cover", height: "500px" }}>
          <Box>
            
            <CardMedia
              image={cover}
              sx={{
                width: "836px",
                height: "310px",
                position: "relative",
                backgroundColor:"lightgray"
              }}
            />
            <Avatar
              src={photo}
              alt=""
              sx={{
                position: "absolute",
                top: 340,
                left: 609,
                width: 132,
                height: 132,
                border: "5px solid white"
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{mt:13,width:"587px",display:"flex",justifyContent:"center",pl:"101px"}}>


          
            <Box sx={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {username}
              </Typography>

              <Box sx={{ display:"flex",justifyContent:"center" }}>
                <Typography>
                {bio}
                </Typography>
              </Box>
            </Box>
            </Box>
            <Box sx={{mt:1,mr:1,height:"40px",padding:1 }}>
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
           gap: "10px",
           height: 100,
           width: "96%",
           p: 1,
         }}
       >
         <Box sx={{ml:5}}>
           <Avatar src={photo} alt="" sx={{width:50,height:50}} />
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

         <Button variant="contained" type="submit" sx={{width:100,borderRadius:"10px"}}>
           POST
         </Button>
       </Card> </Box>: <></>}
       
      </Box>
      <Box>
      <Box sx={{mt:1}}>
      {posts.map((row, key) => (
        <SinglePost props={row} key={key} fetchPost={fetchPost}/>
      ))}
    </Box>
    </Box>
    </Box>
  );
};

export default Profile;
