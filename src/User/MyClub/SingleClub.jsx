import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../config/FireBase";

export default function SingleClub({ row, key }) {
          const [count,setCount] = useState(0);
          const [countposts,setCountPosts] = useState("");

  const getFollowers = async () => {
    const coll = collection(db, "clubfollowers");
    const q = query(coll, where("club_id", "==", row.clubInfo.id));
    const snapshot = await getCountFromServer(q);
    console.log(snapshot.data().count);
    setCount(snapshot.data().count);
  };

  const getPosts = async () => {
    const coll = collection(db, "Posts");
    const q = query(coll, where("club_id", "==", row.clubInfo.id));
    const snapshot = await getCountFromServer(q);
    console.log(snapshot.data().count);
    setCountPosts(snapshot.data().count);
  };

  useEffect(() => {
          getFollowers();
          getPosts()
        }, []);
  return (
    <div>
      <Link
        to={`/User/ClubPost/${row.club_id}`}
        style={{ textDecoration: "none" }}
      >
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
                src={row.clubInfo.club_photo}
                sx={{ width: "60px", height: "60px" }}
                alt=""
              />

              <div>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: 23 }}
                >
                  {row.clubInfo.club_name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 5, mr: 0.5 }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: "0.767rem" }}>
                    {count +" "+"Followers"}
                  </Typography>
                  <FiberManualRecordIcon sx={{ fontSize: 5, mr: 0.5, ml: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.767rem" }}>
                  {countposts + " " + "Posts"}
                  </Typography>
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
