import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/FireBase";
import { Typography, Box, Card, Avatar } from "@mui/material";
import SinglePostAd from "../SinglePostAd";

const UserDetails = () => {
  const [username, setUsername] = useState("");
  const [userprofilepic, setUserprofilepic] = useState("");
  const [userbio, setUserbio] = useState("");
  const [postCount, setPostCount] = useState("");
  const [follows, setFollow] = useState("");
  const [posts, setPosts] = useState([]);

  const { id } = useParams();
  console.log(id);

  const fetchUser = async (id) => {
    const DocRef = doc(db, "users", id);
    const DocSnap = (await getDoc(DocRef)).data();
    setUsername(DocSnap.user_name);
    setUserprofilepic(DocSnap.user_profilepic);
    setUserbio(DocSnap.user_bio);

    const Posts = collection(db, "Posts");
    const Postsquery = query(Posts, where("user_id", "==", id));
    const Postsnapshot = await getCountFromServer(Postsquery);
    setPostCount(Postsnapshot.data().count);

    const following = collection(db, "clubfollowers");
    const queryfollow = query(following, where("clubfollower_id", "==", id));
    const queryfollowsnapshot = await getCountFromServer(queryfollow);
    setFollow(queryfollowsnapshot.data().count);
  };

  const fetchPosts = async (id) => {
    const DocRef = doc(db, "users", id);
    const DocSnap = (await getDoc(DocRef)).data();

    const userPosts = collection(db, "Posts");
    const userPostsquery = query(userPosts, where("user_id", "==", id),orderBy("post_time","desc"));
    const userPostdata = await getDocs(userPostsquery);
    const userPostDataMap = userPostdata.docs.map((doc) => ({
      id: doc.id,
      userInfo: DocSnap,
      ...doc.data(),
    }));

    const joinedData = userPostDataMap.map((post) => {
      const userInfo = post.userInfo;
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

      return {
        ...post,
        userInfo: userInfo,
        formattedTimeDifference: formattedTimeDifference,
      };
    });
    setPosts(joinedData);
  };

  useEffect(() => {
    fetchUser(id);
    fetchPosts(id);
  }, [id]);
  return (
    <div style={{ display: "flex",gap:20,alignItems:"center" }}>
      <Box>
        <Typography sx={{fontSize:19,fontWeight:"bold"}}> User Details </Typography>
        <Card sx={{ display: "flex", flexDirection: "column", p: 3, gap: 2,height:300,width:200 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar sx={{ width: 100, height: 100 }} src={userprofilepic} />
            <Typography sx={{ fontWeight: "bold", fontSize: 17 }}>
              {username}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              UserBio:
              <Typography sx={{ fontWeight: "bold" }}>{userbio}</Typography>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>Posts:</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              {postCount}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>CLub Followings:</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              {follows}
            </Typography>
          </Box>
        </Card>
      </Box>

      {postCount != 0 ? (
          <>

        <Box
          sx={{
            border: "1px double grey ",
            width: "700px",
            p: 5,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: 2,
            overflow: "scroll",
            height: 350,
            WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
            "&::-webkit-scrollbar": {
              // Style the scrollbar
              display: "none", // Hide the scrollbar
            },
          }}
        >
          {posts.map((row, key) => (
            <SinglePostAd props={row} key={key} />
          ))}
        </Box>
          </>
        
      ) : (
        ""
      )}
    </div>
  );
};

export default UserDetails;
