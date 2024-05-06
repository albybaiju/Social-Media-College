import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/FireBase";

export default function SingleClubJo({ row, key, fetchclubs }) {
  const [count, setCount] = useState(0);
  const [countposts, setCountPosts] = useState("");

  const getFollowers = async () => {
    const coll = collection(db, "clubfollowers");
    const q = query(coll, where("club_id", "==", row.id));
    const snapshot = await getCountFromServer(q);
    console.log(snapshot.data().count);
    setCount(snapshot.data().count);
  };

  const getPosts = async () => {
    const coll = collection(db, "Posts");
    const q = query(coll, where("club_id", "==", row.id));
    const snapshot = await getCountFromServer(q);
    console.log(snapshot.data().count);
    setCountPosts(snapshot.data().count);
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
    getFollowers();
    getPosts();
  }, []);
  return (
    <div>
      {/* 
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
              />                </Box>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link> */}

      <Card className="club-carduser" elevation={3} key={key}>
        <CardContent
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p:3
          }}
        >
      
          <Box sx={{display:"flex",gap:2}}>
          <Link
        to={`/User/ClubPost/${row.id}`}
        style={{ textDecoration: "none",display:"flex",alignItems:"center",gap:7,color:"black"}}
      >
          <Avatar
                src={row.club_photo}
                sx={{ width: "60px", height: "60px" }}
                alt=""
              />

              <Box>
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
                    {count +" "+"Followers"}
                  </Typography>
                  <FiberManualRecordIcon sx={{ fontSize: 5, mr: 0.5, ml: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: "0.767rem" }}>
                  {countposts + " " + "Posts"}
                  </Typography>
            </Box>
          </Box>
          </Link>
          </Box>
         
          <Box>
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
          </Box>





        </CardContent>
      </Card>
    </div>
  );
}
