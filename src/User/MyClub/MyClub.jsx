import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./myclubs.css";
import { db } from "../../config/FireBase";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Link } from "react-router-dom";
import SingleClub from "./SingleClub";

const Myclubs = () => {
  const [myclubs, setMyclubs] = useState([]);

  const fetchClubs = async () => {
    const uid = sessionStorage.getItem("uid");

    try {
      const clubRef = collection(db, "clubfollowers");

      const q = query(clubRef, where("clubfollower_id", "==", uid));

      const clubSnapshot = await getDocs(q);
      const clubData = clubSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const queryclub = await getDocs(collection(db, "Clubs"));
      const queryclubData = queryclub.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const joinedData = clubData
        .map((clubs) => ({
          ...clubs,
          clubInfo: queryclubData.find((club) => club.id === clubs.club_id),
        }))
        .filter((club) => club.clubInfo && club.clubInfo.club_name);

      setMyclubs(joinedData);
      console.log(joinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  return (
    <Box className="club-box" sx={{ margin: "20px", gap: "20px" }}>
      <Typography variant="h4">Clubs</Typography>

      {myclubs.map((row, key) => (
        <SingleClub row={row} key={key} />
      ))}
    </Box>
  );
};

export default Myclubs;
