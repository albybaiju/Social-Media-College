import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  CardMedia,
  Avatar,
} from "@mui/material";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { db, storage } from "../../config/FireBase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';
import { Link,useNavigate } from "react-router-dom";
import ReactDOM from "react-dom"



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

const SetProfileB = () => {
  const [username, setNewUsename] = useState();
  const [currPhoto, setcurrentPhoto] = useState("");
  const [photo, setPhoto] = useState([]);
  const [setusername, setSetusername] = useState("");
  const [loading, setloading] = useState("");
  const [userbio,setUserbio]=useState("")

  const [file, setFile] = useState(null);


  const handleSetFile = async () => {
    const jsxImage = <img src="\Imags\default-avatar-icon-of-social-media-user-vector.jpg"/>;
    const src = jsxImage.props.src;
    const filename = src.substring(src.lastIndexOf('/') + 1);
    const response = await fetch(src);
    const blob = await response.blob();
    const file = new File([blob], filename, {
      lastModified: new Date(),
      type: blob.type,
    });
    setFile(file);
  };
console.log(file);


  console.log(photo);


 
  const navigate = useNavigate()

  const uid = sessionStorage.getItem("uid");

  const fetchuser = async () => {
    const userRef = doc(db, "users", uid);

    const userDetails = (await getDoc(userRef)).data();

    setNewUsename(userDetails.user_name)



    // Check if the field is present in the document data
    const data = userDetails;
    const fieldname = "user_profilepic";
    if (fieldname in data) {
      setcurrentPhoto(userDetails.user_profilepic);
    } else {
      setcurrentPhoto("");
    }
  };





  const change = async () => {
    const generateUniqueFileName = (uid, originalFileName) => {
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string
      const uniqueName = `${uid}_${timestamp}_${randomString}_${originalFileName}`;
      return uniqueName;
    };

    if (photo == "") {

      

      setloading(true);
      const metadata = {
        contentType: "image/jpeg",
      };

      const uniqueFileName = generateUniqueFileName(uid, file.name);
    const storageRef = ref(storage, "images/" + uniqueFileName);
    await uploadBytesResumable(storageRef, file, metadata);
    const url = await getDownloadURL(storageRef);

    console.log("File uploaded successfully:", url);

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      user_profilepic: url,
    });
      setloading(false);
      setSetusername(true);
    } 
    
    
    
    else {
      setloading(true);
      const metadata = {
        contentType: "image/jpeg",
      };

      const uniqueFileName = generateUniqueFileName(uid, photo.name);
      const storageRef = ref(storage, "images/" + uniqueFileName);
      await uploadBytesResumable(storageRef, photo, metadata);
      const url = await getDownloadURL(storageRef).then((downloadURL) => {
        return downloadURL;
      });

      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        user_profilepic: url,
      });
      setloading(false);
      setSetusername(true);
    }
  };

  const back = () => {
    setSetusername(false);
  };

  const selectPhoto = async (e) => {
    const photo = e.target.files[0];
    setPhoto(photo);
    const reader = new FileReader();
    reader.onload = function (e) {
      setcurrentPhoto(e.target.result);
    };
    reader.readAsDataURL(photo);
  };

  const saveBio = async () =>{
    if(userbio === ""){
      console.log("no Bio you can skip");
      navigate("../../User")

    }
    else{
    
      console.log("hello");
      const userRef = doc(db, "users", uid);
       await updateDoc(userRef, {
        user_bio: userbio
      });
      setloading(true)
      navigate("../../User")
      
    }
  }

 




  useEffect(() => {
    fetchuser();
    handleSetFile()

  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", m: 2 }}>
        <img
          style={{ width: "120px", height: "40px" }}
          src="\Imags\dcccedog.png"
        />
      </Box>

      <Card
        elevation={3}
        sx={{
          ml: 60,
          display: "flex",
          flexDirection: "column",
          width: "600px",
          height: "550px",
          borderTop: "8px solid #EE782C ",
          padding: 4,
        }}
      >
        {loading ? (
          <LinearProgress
            sx={{ width: "665px", position: "absolute", top: 76, left: 480 }}
          />
        ) : (
          ""
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Welcome to <span>DC</span>onnect,{username} !
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography>
            Welcome to DConnect, DC College's digital community,where
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {" "}
              connections thrive and opportunities await!🎓✨
            </Box>{" "}
          </Typography>
        </Box>
        <Box>
          {setusername ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 4,
                mt: 9,
              }}
            >
              <Typography sx={{display:"flex",justifyContent:"center",fontWeight:"bold",fontSize:"16px"}}>Set Your bio </Typography>
              <input
                type="text"
                id="standard-basic"
                variant="standard"
                className="usernamebar"
                style={{
                  marginLeft: 170,
                  width: "250px",
                  height: "40px",
                  border: "1px solid ",
                  paddingLeft: "10px",
                  borderRadius: "20px",
                  fontSize:"15px",
                  position:"relative"
                }}
                onChange={(e)=> setUserbio(e.target.value)}
                value={userbio}
              />

            

            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                mt: 8,
              }}
            >
              <Avatar
                src={currPhoto}
                sx={{ width: "100px", height: "100px", ml: 31 }}
              />

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Edit Profile
                  <VisuallyHiddenInput type="file" onChange={selectPhoto} />
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "right", gap: 2, mt: 23 }}>
          {setusername ? (
            <Button variant="contained" sx={{ width: "85px" }} onClick={back}>
              Back
            </Button>
          ) : (
            ""
          )}

          {setusername ? (
            <Button variant="contained" onClick={saveBio} >{loading ? <CircularProgress sx={{fontSize:"small"}}/> :"Go to Home"} </Button>
                      ) : (
            <Button variant="contained" sx={{ width: "80px" }} onClick={change}>
              Next
            </Button>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default SetProfileB;
