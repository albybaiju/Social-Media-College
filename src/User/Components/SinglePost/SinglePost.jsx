import React, { useCallback, useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import "./singlePost.css";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Popover,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db, storage } from "../../../config/FireBase";
import Comments from "../Comments/Comments";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Link } from "react-router-dom";
import { deleteObject, ref } from "firebase/storage";

const SinglePost = ({ props, fetchPost }) => {

  
  const [comment, SetComment] = useState("");
  const [like, SetLike] = useState("");
  const [clubname, setClubname] = useState("");
  const [likecount, setLikecount] = useState("");
  const [commentcount, SetCommentcount] = useState("");
  const [likegr, setLikegr] = useState("");
  const [commentgr, setCommentgr] = useState("");
  const [checkd, setCheckD] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [checkphoto, checkPhoto] = useState(false);



  const checkPhotoinprops = () =>{

    console.log(props);

    const fieldname = "post_photo"
    const data = props;
    if(fieldname in data){
      checkPhoto(true)
    }
  }

 
  const deletePost = async (id) => {

    if(checkphoto){

      const snapShotData = await getDoc(doc(db, "Posts", id));
      const postData = snapShotData.data();
      const storageReference = postData.post_photo;
        // Create a reference to the file to delete
    const StorageRef = ref(storage, storageReference);

      // Delete the file
      deleteObject(StorageRef)
      .then(() => {
        alert("Post Deleted")
      })
      .catch((error) => {
        const errorcode = error.code;
        const errormessage = error.errormessage;
        console.log(errormessage);
        alert(errorcode);
      })

    await deleteDoc(doc(db, "Posts", id));
    await fetchPost();
    }

    else{
      await deleteDoc(doc(db, "Posts", id));
      alert("Post is deleted")
      await fetchPost();
    }
    
    
    
    
  


  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const checkDelete = () => {
    const uid = sessionStorage.getItem("uid");
    if (props.user_id === uid) {
      setCheckD(true);
    }
  };

  const fetchLikecount = async () => {
    const coll = collection(db, "Likes");
    const q = query(coll, where("post_id", "==", props.id));
    const snapshot = await getCountFromServer(q);
    setLikecount(snapshot.data().count);

    if (snapshot.data().count > 1) {
      setLikegr(true);
    } else {
      setLikegr(false);
    }
  };

  const fetchCommentcount = async () => {
    const coll = collection(db, "Comments");
    const qComment = query(coll, where("post_id", "==", props.id));
    const commentSnapshot = await getCountFromServer(qComment);
    SetCommentcount(commentSnapshot.data().count);

    if (commentSnapshot.data().count > 1) {
      setCommentgr(true);
    }
  };

  const addLike = async (id) => {
    const uid = sessionStorage.getItem("uid");
    const timestamp = serverTimestamp();

    await addDoc(collection(db, "Likes"), {
      post_id: id,
      user_id: uid,
      like_time:timestamp,
      post_userid:props.userInfo.id
    });

    SetLike(true);
    fetchLikecount();
  };

  const removeLike = async (id) => {
    const uid = sessionStorage.getItem("uid");

    const PostRef = collection(db, "Likes");

    const q = query(
      PostRef,
      where("post_id", "==", id),
      where("user_id", "==", uid)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    fetchLikecount();
    SetLike(false);
  };

  const ShowCommentbox = (id) => {
    const comment = true;
    SetComment(comment);
  };

  const NoCommentbox = () => {
    const nocomment = false;
    SetComment(nocomment);
  };

  const fetchData = useCallback(async () => {
    const uid = sessionStorage.getItem("uid");

    const LikeRef = collection(db, "Likes");

    const qData = query(
      LikeRef,
      where("post_id", "==", props.id),
      where("user_id", "==", uid)
    );
    const queryData = await getDocs(qData);

    if (queryData.empty) {
      SetLike(false);
    } else {
      SetLike(true);
    }

    try {
      if (props.clubInfo !== "") {
        setClubname(true);
      } else {
        setClubname(false);
      }
    } catch (error) {
      const errorcode = error.code;
      const errormessage = error.errormessage;
      console.log(errormessage);
      console.log(errorcode);
    }
  }, [props.id, props.clubInfo]);

  useEffect(() => {
    fetchData();
    fetchLikecount();
    fetchCommentcount();
    checkDelete();
    checkPhotoinprops()
  }, [fetchData]);
  return (
    <Box>
      <Card className="post" elevation={2}>
        <div className="containerpost">
          <div className="postuser">
            <div className="postuserinfo">
              <div className="more">
                <Avatar src={props.userInfo.user_profilepic} alt="/"></Avatar>
                <div className="details">
                  <Link
                    to={
                      clubname
                        ? `/User/ClubPost/${props.clubInfo.id}`
                        : `/User/Profile/${props.user_id}`
                    }
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {clubname
                        ? props.clubInfo.club_name
                        : props.userInfo.user_name}
                    </span>
                  </Link>
                  <span style={{ fontSize: "13px", color: "grey" }}>
                    {props.formattedTimeDifference}
                  </span>
                </div>
              </div>
              {checkd && (
                <div>
                  <MoreHorizIcon
                    onClick={handleClick}
                    sx={{ cursor: "pointer" }}
                  />
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Typography
                      sx={{ p: 2, cursor: "pointer" }}
                      onClick={() => deletePost(props.id)}
                    >
                      Delete
                    </Typography>
                  </Popover>
                </div>
              )}
            </div>
            <div className="content">
              <p>{props.post_caption}</p>

              {checkphoto ? 
              
              <CardMedia
              image={props.post_photo}
              sx={{
                width: "100%",
                height: "490px",
                borderRadius: "5px",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
               
        
               :""
            
              
            }
          
              <div className="like">
                <div className="itempost">
                  {like ? (
                    <FavoriteOutlinedIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => removeLike(props.id)}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      onClick={() => addLike(props.id)}
                      sx={{ cursor: "pointer" }}
                    />
                  )}
                  {likecount} {likegr ? "likes" : "like"}
                </div>
                <div className="itempost">
                  {comment ? (
                    <ModeCommentIcon onClick={() => NoCommentbox()} />
                  ) : (
                    <ModeCommentOutlinedIcon
                      sx={{ cursor: "pointer" }}
                      onClick={() => ShowCommentbox(props.id)}
                    />
                  )}
                  {commentcount} {commentgr ? "comments" : "comment"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {comment && (
            <Comments props={props} fetchCommentcount={fetchCommentcount} />
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default SinglePost;
