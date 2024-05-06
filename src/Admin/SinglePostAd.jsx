import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  Box,
  Typography,
  Avatar,
  CardMedia,
  TableHead,
  Button,
  Card,
} from "@mui/material";
import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../config/FireBase";

const SinglePost = ({ props }) => {
  const [likec, setLIkec] = useState("");
  const[commentc,setCoomentC]=useState('')

  const fetchCounts = async () => {
    console.log(props.id);

    const LikeRef = collection(db, "Likes");
    const qData = query(LikeRef, where("post_id", "==", props.id));
    const qDatasnap = await getCountFromServer(qData);
    setLIkec(qDatasnap.data().count);

    const commentsRef = collection(db, "Comments");
    const commentsqData = query(commentsRef, where("post_id", "==", props.id));
    const commentsqDatasnap = await getCountFromServer(commentsqData);
    setCoomentC(commentsqDatasnap.data().count);

  };

  useEffect(() => {
    fetchCounts();
  }, []);
  return (
    <div style={{ width: "295px" }}>
      <Card sx={{ width: "84%", p: 1 }} elevation={3}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={props.userInfo.user_profilepic} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {props.userInfo.user_name}
                </Typography>
                <Typography sx={{ fontSize: "11px" }}>
                  {props.formattedTimeDifference}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography>{props.post_caption}</Typography>
            <CardMedia
              sx={{ width: "250px", height: 250 }}
              image={props.post_photo}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid grey",
                width: 59,
                backgroundColor: "#F3EBE9",
                p:1
              }}
            >
              <Typography>{likec}</Typography>
              <Typography sx={{ mb: 1 }}>.</Typography>
              <Typography>Likes</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid grey",
                width: 104,
                backgroundColor: "#F3EBE9",
                p:1
              }}
            >
              <Typography>{commentc}</Typography>
              <Typography sx={{ mb: 1 }}>.</Typography>
              <Typography>Comments</Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default SinglePost;
