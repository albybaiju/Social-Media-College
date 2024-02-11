import React, { useEffect, useState } from "react";
import "./stories.css";
import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Modal,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../../config/FireBase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Stories = () => {
  const [story, setStory] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [caption, SetCaption] = useState("");
  const [storypic, setStorypic] = useState();
  const [ownstory, setOwnStory] = useState("");
  const [stories, setStories] = useState([]);
  const [checkothers, setCheckOthers] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
  };

  const opens = Boolean(anchorEl);
  const id = opens ? "simple-popover" : undefined;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generateUniqueFileName = (uid, originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
    const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
    return uniqueName;
  };

  const addStory = async (e) => {
    const photo = e.target.files[0];
    setStorypic(photo);
    console.log(photo);

    const reader = new FileReader();
    reader.onload = function (e) {
      setSelectedImage(e.target.result);
      handleOpen();
    };
    reader.readAsDataURL(photo);
  };

  const addstorylast = async (e) => {
    e.preventDefault();
    handleClose();
    const metadata = {
      contentType: "image/jpeg",
    };

    const uid = sessionStorage.getItem("uid");
    const uniqueFileName = generateUniqueFileName(uid, storypic.name);
    const storageRef = ref(storage, "images/" + uniqueFileName);
    await uploadBytesResumable(storageRef, storypic, metadata);
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

    const timestamp = serverTimestamp();
    await addDoc(collection(db, "Stories"), {
      Story_caption: caption,
      Story_photo: url,
      user_id: uid,
      Story_time: timestamp,
    });
    fetchStory();
  };

  const deleteStory = async (id) => {
    const StorypicRef = await getDoc(doc(db, "Stories", id));
    const StoryData = StorypicRef.data();
    const storageReference = StoryData.Story_photo;
    const StorageRef = ref(storage, storageReference);

    deleteObject(StorageRef)

    await deleteDoc(doc(db, "Stories", id));
    fetchStory();
  };

  const fetchStory = async () => {
    const uid = sessionStorage.getItem("uid");
    const story = query(collection(db, "Stories"), where("user_id", "==", uid));
    const UserStory = await getDocs(story);
    const userStoryData = UserStory.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(userStoryData);
    if (userStoryData == 0) {
      setOwnStory(false);
    } else {
      setOwnStory(true);
      setStory(userStoryData);
    }
    // Assuming you have a field like 'createdAt' in your story data.
    const currentDate = new Date();
    userStoryData.forEach((story) => {
      const storyCreationDate = story.Story_time.toDate(); // Assuming 'createdAt' is a Firestore timestamp field.
      const timeDifference = currentDate - storyCreationDate;
      const twentyFourHours = 24 * 60 * 60 * 1000; // milliseconds in 24 hours
      if (timeDifference > twentyFourHours) {
        deleteStory(story.id);
        fetchStories();
      }
    });
  };

  const fetchStories = async () => {
    const uid = sessionStorage.getItem("uid");
    const otherStoriesq = query(
      collection(db, "Stories"),
      where("user_id", "!=", uid)
    );

    const otherStories = await getDocs(otherStoriesq);
    console.log(otherStories);
    if (otherStories !== null) {
      const data = otherStories.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCheckOthers(true);
      setStories(data);
    } else {
      setCheckOthers(false);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchStories();
  }, []);

  return (
    <>
      <Box
        sx={{
          width: "800px",
          overflowX: "scroll",
          display: "flex",
          gap: "10px",
          margin: "20px",
          marginBottom: "30px",
          WebkitOverflowScrolling: "touch", // For smoother scrolling on iOS devices

          /* Customize the scrollbar */
          scrollbarWidth: "thin", // Firefox
          scrollbarColor: "#888 #f1f1f1", // Firefox

          "&::-webkit-scrollbar": {
            width: "5px", // Set the width of the scrollbar
            height: "2px",
          },

          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "white", // Set the color of the scrollbar thumb
            borderRadius: "5px", // Set the border radius of the thumb
            width: "3px", // Reduce the width of the scrollbar thumb
            height: "3px", // Reduce the height of the scrollbar thumb
          },

          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // Set the color of the scrollbar track
            height: "1px",
          },

          /* Make the scrollbar visible when scrolling */
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "#cfbbbb", // Change the color on hover
          },
        }}
      >
        {ownstory ? (
          <Card
            sx={{
              width: 150,
              height: 200,
              border: "1px solid green",
              borderRadius: "10px",
              margin: "10px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {story.map((row, key) => (
              <>
                <Box
                  sx={{
                    height: "218px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    image={row.Story_photo}
                    alt=""
                    className="imgstory"
                    key={key}
                    sx={{
                      width: "112px",
                      height: "148px",
                      borderRadius: "0px ",
                      objectFit: "cover",
                      p: 3,
                    }}
                  />
                </Box>
                <Box>
                  <Box sx={{ position: "absolute", top: 10, left: 125 }}>
                    <MoreVertIcon
                      aria-describedby={id}
                      variant="contained"
                      onClick={handlePopClick}
                      sx={{ cursor: "pointer" }}
                    ></MoreVertIcon>
                    <Popover
                      id={id}
                      open={opens}
                      anchorEl={anchorEl}
                      onClose={handlePopClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Typography
                        sx={{ p: 2, cursor: "pointer" }}
                        onClick={() => deleteStory(row.id)}
                      >
                        Delete
                      </Typography>
                    </Popover>
                  </Box>

                  <Typography
                    className="spanstory"
                    style={{ color: "black", marginLeft: "5px" }}
                  >
                    Your Story
                  </Typography>
                </Box>
              </>
            ))}
          </Card>
        ) : (
          <Card
            sx={{
              width: 150,
              height: 200,
              borderRadius: "10px",
              margin: "10px",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Box>
              <Box
                sx={{
                  width: "200px",
                  height: "150px",
                  borderBottom: "1px solid #F2F1EE",
                  backgroundColor: "#F2F1EE",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton
                className="storybutton"
                component="label"
                variant="contained"
                onChange={addStory}
                sx={{
                  position: "absolute",
                  top: "160px",
                  left: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AddCircleOutlineIcon sx={{ color: "black" }} />
                <VisuallyHiddenInput type="file" />
                <Box>
                  <Typography style={{ color: "black", fontSize: "15px" }}>
                    Add Story
                  </Typography>
                </Box>
              </IconButton>
            </Box>
          </Card>
        )}

        {checkothers ? (
          <>
            {stories.map((row, key) => (
              <Card
                sx={{
                  width: 150,
                  height: 195,
                  border: "4px solid green",
                  borderRadius: "10px",
                  margin: "10px",
                  position: "relative",
                  flexShrink: 0,
                  objectFit: "cover",
                }}
              >
                <CardMedia
                  image={row.Story_photo}
                  alt="."
                  key={key}
                  sx={{
                    width: "112px",
                    height: "148px",
                    borderRadius: "0px ",
                    objectFit: "cover",
                    p: 3,
                  }}
                />
              </Card>
            ))}
          </>
        ) : (
          ""
        )}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            component="form"
            onSubmit={addstorylast}
          >
            <Card>
              <CardMedia
                image={selectedImage}
                alt=""
                sx={{ width: 400, height: 400 }}
              />
            </Card>

            <Card sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar src="" alt="" />
              <TextField
                id="standard-basic"
                variant="standard"
                placeholder="Write something"
                sx={{ width: "250px" }}
                onChange={(e) => SetCaption(e.target.value)}
                value={caption}
              />
              <Button
                variant="contained"
                sx={{ width: 20, height: 40, fontSize: "10px" }}
                type="submit"
              >
                Add Story
              </Button>
            </Card>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Stories;
