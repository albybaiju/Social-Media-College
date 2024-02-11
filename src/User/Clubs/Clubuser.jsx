import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Clubuser.css";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/FireBase";

const Clubuser = () => {
  const [showclubs, setShowclubs] = useState([]);

  const fetchclubs = async () => {
    const uid = sessionStorage.getItem("uid");
    console.log(uid);

    const queryclub = await getDocs(collection(db, "Clubs"));
    const querclubData = queryclub.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const clubfollowers = await getDocs(collection(db, "clubfollowers"));
    const clubfollowData = clubfollowers.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const joinedData = querclubData.map((clubs) => ({
      ...clubs,
      clubInfo: clubfollowData.find((club) => club.club_id === clubs.id),
      check: clubfollowData.some(
        (club) => club.club_id === clubs.id && club.clubfollower_id === uid
      ),
    }));

    setShowclubs(joinedData);
  };

  const AddClubid = async (id) => {
    const uid = sessionStorage.getItem("uid");

    await addDoc(collection(db, "clubfollowers"), {
      clubfollower_id: uid,
      club_id: id,
    });
    fetchclubs();
  };

  const deleteClub = async (id) => {
    const deletedDoc = await deleteDoc(doc(db, "clubfollowers", id));

    console.log(deletedDoc);
    fetchclubs();
  };

  useEffect(() => {
    fetchclubs();
  }, []);

  return (
    <Box className="club-box" sx={{ margin: "20px", gap: "20px" }}>
      <Typography variant="h4">Clubs</Typography>

      {showclubs.map((row, key) => (
        <Card className="club-carduser" elevation={3} key={key}>
          <CardContent
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="club-details">
              <Avatar
                src={row.club_photo}
                sx={{ width: "60px", height: "60px" }}
                alt=""
              />

              <div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: 23 }}
                >
                  {row.club_name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 5, mr: 0.5 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: "0.767rem" }}>
                    500 Followers
                  </Typography>
                  <FiberManualRecordIcon sx={{ fontSize: 5, mr: 0.5, ml: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.767rem" }}>
                    12K Posts
                  </Typography>
                </Box>
              </div>
            </div>
            <div>
              {row.check ? (
                <Button
                  variant="contained"
                  type="submit"
                  onClick={() => deleteClub(row.clubInfo.id)}
                >
                  Following
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  type="submit"
                  onClick={() => AddClubid(row.id)}
                >
                  Follow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Clubuser;
