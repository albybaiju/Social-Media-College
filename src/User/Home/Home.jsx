import React, { useEffect, useState } from "react";
import "./Home.css";
import Stories from "../Components/Stories/stories";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../config/FireBase";
import SinglePost from "../Components/SinglePost/SinglePost";
import { Box } from "@mui/material";

const Home = () => {
  const [posts, SetPost] = useState([]);

  const fetchPost = async () => {
    const querys=query(collection(db,"Posts"),orderBy("post_time","desc"))

    const querySnapshot = await getDocs(querys);
    const qData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(qData);

    const user = await getDocs(collection(db, "users"));
    const userData = user.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(userData);

    const clubs = await getDocs(collection(db, "Clubs"));
    const clubData = clubs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(clubData);

    const joinedData = qData.map((post) => {
      const userInfo = userData.find((user) => user.id === post.user_id);
      const clubInfo = clubData.find((clubs) => clubs.id === post.club_id);
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
        clubInfo: clubInfo ? clubInfo : "",
        formattedTimeDifference: formattedTimeDifference,
      };
    });

    SetPost(joinedData);
    console.log(joinedData);
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className="home">
      <div>
        <Stories />
      </div>
      <div>
        <Box>
          {posts.map((row, key) => (
            <SinglePost props={row} key={key} fetchPost={fetchPost}/>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default Home;
