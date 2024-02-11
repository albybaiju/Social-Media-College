import {
  Avatar,
  Box,
  Button,
  Card,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./Comments.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../config/FireBase";
import DeleteIcon from "@mui/icons-material/Delete";

const Comments = ({ props, fetchCommentcount }) => {

  const uid = sessionStorage.getItem("uid");
  const [comment, setComment] = useState("");
  const [showcomments, SetShowComments] = useState([]);
   const [deleteoption, setDeleteoption] = useState("");

  const { id } = props;
  const timestamp = serverTimestamp();



  const deleteComment = async (id) => {
    await deleteDoc(doc(db, "Comments", id));
    fetchComments();
    fetchCommentcount()

  };

  const checkDeletecomment = () => {
    const uid = sessionStorage.getItem("uid");
    const qQuery= query(collection(db,"Comments"),where("user_id","==",uid))
    const qSnapshot = getDocs(qQuery)
    console.log(qSnapshot)
    if(qSnapshot){
      setDeleteoption(true)
    }
  }

  const addComments = async () => {
  

    await addDoc(collection(db, "Comments"), {
      post_id: id,
      user_id: uid,
      comment_content: comment,
      comment_time: timestamp,
    });
    setComment("");
    fetchComments();
    fetchCommentcount()
  };

  const fetchComments = useCallback(async () => {
    // const uid = sessionStorage.getItem('uid')
    const commentRef = collection(db, "Comments");
    const qData = query(
      commentRef,
      where("post_id", "==", id),
      orderBy("comment_time")
    );

    const querySnapshot = await getDocs(qData);

    const querySnapshotData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const fetchUsers = await getDocs(collection(db, "users"));
    const dataFetchUsers = fetchUsers.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const joinedData = querySnapshotData.map((comments) => {
      const userInfo = dataFetchUsers.find(
        (users) => users.id === comments.user_id
      );

      // Calculate time difference
      const currentTime = new Date();

      const uploadedTime = comments.comment_time.toDate(); // Assuming 'timestamp' is the field storing the upload time

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
        formattedTimeDifference = `${minutesDifference} m ago`;
      } else {
        formattedTimeDifference = `${secondsDifference}s ago`;
      }

      // Add the formatted time difference to the post object
      return {
        ...comments,
        userInfo: userInfo,
        formattedTimeDifference: formattedTimeDifference,
      };
    });
    SetShowComments(joinedData);
  }, [id]);

  useEffect(() => {
    fetchComments();
     checkDeletecomment();
    fetchCommentcount()
  }, [fetchComments]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card sx={{ padding: 5, my: 4 }}>
        <Typography sx={{ mb: 3 }}>Comments</Typography>
        <Box
          sx={{
            ml: 7,
            mr: 7,
            width: "500px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            padding: "15px",
            overflow: "scroll",
          }}
          className="commentbox"
        >
          {showcomments.map((row, key) => (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "1px" }}
              key={key}
            >
              <Box
                sx={{
                  backgroundColor: "#F7F5F2",
                  border: "1px",
                  borderRadius: "30px",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src="" alt="" />
                    <Typography
                      sx={{ fontWeight: "bold", mr: 3 }}
                      value={row.userInfo.id}
                    >
                      {row.userInfo.user_name}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 4, mt: 2, mb: 2, mr: 5 }}>
                    {row.comment_content}
                  </Box>
                </Box>
                <Box>
                  <Box>
                    {row.userInfo.id === uid ? <DeleteIcon
                        sx={{ fontSize: "14px", cursor: "pointer" }}
                        onClick={() => deleteComment(row.id)}
                      />:<></>
                    }
                 
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    display: "flex",
                    mr: 1,
                    mt: 1,
                    justifyContent: "right",
                  }}
                >
                  {row.formattedTimeDifference}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            mt: 5,
            ml: 4,
          }}
        >
          <Avatar src="" alt="" />
          <Box
            sx={{
              width: "420px",
              border: "1px solid",
              borderRadius: "30px",
              pl: "20px",
            }}
          >
            <TextField
              id="standard-basic"
              variant="standard"
              placeholder="Write a Comment"
              sx={{ width: "399px" }}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </Box>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={addComments}
          >
            Send
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default Comments;
