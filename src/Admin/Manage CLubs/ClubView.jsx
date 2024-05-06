import React from "react";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../config/FireBase";
import { Typography, Box, Card, Avatar} from "@mui/material";

const ClubView = () => {
  const { id } = useParams();

  const [username, setUsername] = useState("");
  const [userprofilepic, setUserprofilepic] = useState("");
  const [userbio, setUserbio] = useState("");
  const [postCount, setPostCount] = useState("");
  const [follows, setFollow] = useState("");
  const[aid,setAdminid]=useState("")
  const[adname,setAdminame]=useState("")
  const[adminpic,setAdminpic]=useState("")




  
  const fetchUser = async (id) => {
    const DocRef = doc(db, "Clubs", id);
    const DocSnap = (await getDoc(DocRef)).data();
    setUsername(DocSnap.club_name);
    setUserprofilepic(DocSnap.club_photo);
    setUserbio(DocSnap.club_motto);
    setAdminid(DocSnap.club_admin)

    const adminRef = doc(db, "users",aid);
    const DocSnapad = (await getDoc(adminRef)).data();
    setAdminame(DocSnapad.user_name);
    setAdminpic(DocSnapad.user_profielpic)

    const Posts = collection(db, "Posts");
    const Postsquery = query(Posts, where("club_id", "==", id));
    const Postsnapshot = await getCountFromServer(Postsquery);
    setPostCount(Postsnapshot.data().count);

    const following = collection(db, "clubfollowers");
    const queryfollow = query(following, where("club_id", "==", id));
    const queryfollowsnapshot = await getCountFromServer(queryfollow);
    setFollow(queryfollowsnapshot.data().count);
  };



  useEffect(() => {
    fetchUser(id);
  }, [id]);

  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <Box>
        <Typography sx={{ fontSize: 19, fontWeight: "bold" }}>
          {" "}
          User Details{" "}
        </Typography>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 3,
            gap: 2,
            height: 350,
            width: 300,
          }}
        >
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
            <Typography>Club Followers:</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              {follows}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>Club Admin</Typography>
            <Box sx={{display:"flex",alignItems:'center'}}>
            <Avatar src={adminpic}/>
            <Typography sx={{ fontWeight: "bold", fontSize: 14 }}>
              {adname}
            </Typography>
            </Box>           
          </Box>

          
        </Card>
      </Box>
    </div>
  );
};

export default ClubView;
