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
import React, { useCallback, useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import styled from "@emotion/styled";
import {
  addDoc,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, storage } from "../../config/FireBase";
import { Link, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import SinglePost from "../Components/SinglePost/SinglePost";

const ClubPost = () => {
  const { id } = useParams();
  const [posts, SetPost] = useState([]);
  const [caption, SetCaption] = useState("");
  const [photo, SetPhoto] = useState("");
  const [check, setCheck] = useState(false);
  const [clubProfilename, setClubProfilename] = useState("");
  const [clubProfilemotto, setClubProfilemotto] = useState("");
  const [clubProfilePhoto, setClubProfilePhoto] = useState("");
  const [clubAdmin, setClubAdmin] = useState("");
  const [clubcategory, setClubcategory] = useState("");
  const[clubfollowers,setClubfollowers]=useState("")
  const [clubfollowgr,setFollowgr]=useState(false)
  const [clubpostgr,setPostgr]=useState(false)
  const[postcount,setPostcount]=useState("")
 const[adpic,setClubAdPic]=useState("")
  





const followersCount = async() =>{

const coll = collection(db, "clubfollowers");
const q = query(coll, where("club_id", "==", id));
const snapshot = await getCountFromServer(q);
setClubfollowers(snapshot.data().count)
if(snapshot.data().count > 1){
  setFollowgr(true)
}
}




const PostsCount = async() =>{
  const coll = collection(db, "Posts");
  const q = query(coll, where("club_id", "==", id));
  const snapshot = await getCountFromServer(q);
  setPostcount(snapshot.data().count)
  if(snapshot.data().count > 1){
    setPostgr(true)
  }
  }



  const clubName = async () => {
    const clubReference = doc(db, "Clubs", id);
    const clubDetailsData = (await getDoc(clubReference)).data();
    setClubProfilename(clubDetailsData.club_name);
    setClubProfilemotto(clubDetailsData.club_motto);
    setClubProfilePhoto(clubDetailsData.club_photo);
   


    const AdminReference = doc(db, "users", clubDetailsData.club_admin);
    const adminDetails = (await getDoc(AdminReference)).data();
    setClubAdmin(adminDetails.user_name);
    setClubAdPic(adminDetails.user_profilepic)
    

    const categoryReference = doc(
      db,
      "Category",
      clubDetailsData.club_category
    );
    const categoryDetails = (await getDoc(categoryReference)).data();
    setClubcategory(categoryDetails.category);
  };

  const checkAdmin = async () => {
    const uid = sessionStorage.getItem("uid");
    const docRef = doc(db, "Clubs", id);
    const docSnap = (await getDoc(docRef)).data();
    if (docSnap.club_admin === uid) {
      setCheck(true);
    } else {
      setCheck(false);
    }
    // const { club_admin } = docSnap;
    // setAdmin(club_admin);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const uid = sessionStorage.getItem("uid");
    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "images/" + photo.name);
    await uploadBytesResumable(storageRef, photo, metadata);
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

    const timestamp = serverTimestamp();
     await addDoc(collection(db, "Posts"), {
      post_caption: caption,
      user_id: uid,
      post_photo: url,
      club_id: id,
      post_time: timestamp,
    });
    SetCaption("");
    SetPhoto("");
    fetchPost();
  };

  const fetchPost = useCallback(async () => {
    const q = query(collection(db, "Posts"), where("club_id", "==", id));

    const querySnapshot = await getDocs(q);
    const qData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const clubSnapshot = await getDocs(collection(db, "Clubs"));
    const clubData = clubSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const user = await getDocs(collection(db, "users"));
    const userData = user.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const joinedData = qData.map((post) => {
      const userInfo = userData.find((user) => user.id === post.user_id);
      const clubInfo = clubData.find((club) => club.id === post.club_id);

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
    });

    SetPost(joinedData);
  }, [id]);

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

  

  useEffect(() => {
    fetchPost();
    checkAdmin();
    clubName();
    followersCount()
    PostsCount()
  }, [fetchPost]);

  return (
    <Box sx={{ m: "2" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Card sx={{ m: 1, objectFit: "cover" }}>
          <Box>
          <CardMedia
              image={clubProfilePhoto}
              sx={{
                width: "836px",
                height: "350px",
                position: "relative",
                backgroundColor:"lightgray"
              }}
            />
        

            {/* <Avatar
              src=
              alt=""
              sx={{
                position: "absolute",
                top: 340,
                left: 364,
                width: "120px",
                height: 120,
                border: "3px solid white ",
              }}
            /> */}
          </Box>

          <Box sx={{ mt: 4,display:'flex',alignItems:'center',flexDirection:"column" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {clubProfilename}
            </Typography>
            <Typography sx={{color:'grey',}}>{clubcategory}</Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <FiberManualRecordIcon sx={{ fontSize: 8, mr: 0.9 }} />
              </Box>
              <Typography variant="body2" sx={{ fontSize: "14px" }}>
               {clubfollowers} {clubfollowgr ? "followers" : "follower" }
              </Typography>
              <FiberManualRecordIcon sx={{ fontSize: 8, mr: 0.8, ml: 1 }} />
              <Typography variant="body2" sx={{ fontSize: "14px" }}>
                {postcount} {clubpostgr ? "Posts" : "Post"}
              </Typography>
            </Box>

            <Box sx={{ mt: 2,mb:2,display:'flex',flexDirection:"column",gap:2,justifyContent:"center" }}>
              <Box sx={{display:'flex',alignItems:'center',gap:1}}>
              <Typography sx={{fontWeight:"bold"}}>{clubProfilemotto}</Typography></Box>
              <Box sx={{display:"flex",alignItems:'center',gap:1,ml:16}}>
                Admin:
                <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                <Avatar src={adpic} alt="" sx={{width:"20px",height:"20px"}}/>
                <Typography sx={{fontWeight:"bolder"}}>{clubAdmin}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
        {check && (
          <Box>
            <Card
              sx={{
                m: 1,
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
                onSubmit={handlePost}
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

                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  type="submit"
                  sx={{ borderRadius: "30px" }}
                >
                  POST
                </Button>
              </Box>
            </Card>
          </Box>
        )}
         <Box>
      {posts.map((row, key) => (
        <SinglePost props={row} key={key} fetchPost={fetchPost}/>
      ))}
    </Box>
      </Box>
    </Box>
  );
};

export default ClubPost;
