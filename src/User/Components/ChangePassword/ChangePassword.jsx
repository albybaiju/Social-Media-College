
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config/FireBase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const sendEmail = () => {
    const user = auth.currentUser;
    const useremail= user.email
    console.log(user);
    if(useremail === email){      
      sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Verification sent")
        navigate("../../../");
        setEmail("")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorCode)
      })

    }
    else{
      alert ("Your Email doesn't Match");
    }

  };

  // const handleClickShowPassword = () => setShowPassword((show) => !show);

  // const handleMouseDownPassword = (event) => {
  //   event.preventDefault();
  // };

  // const handleSubmit = async() => {
  //    console.log("helooo")
  // }
  return (
    <Box>
      <Typography variant="h4" sx={{ m:2 ,fontWeight:"bold" }}>
        Change Password{" "}
      </Typography>
      <Box sx={{display:"flex",justifyContent:"center",padding:10}}>
      <Card elevation={3} sx={{ m: 2, width: "700px" }} component="form">
        <CardContent
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Typography variant="h5">Email Verification</Typography>
          <Box sx={{display:"flex",flexDirection:"column"}}>
          <Typography> Please enter the email address linked to Dconnect. </Typography>
          <Typography>A recovery link will be sent to the email address.</Typography>

          </Box>
          <Stack spacing={2} direction="column">
          <TextField id="standard-basic" label="Email" variant="standard" sx={{width:"400px"}}
          value={email}
          onChange={(e)=>setEmail(e.target.value)} />
            <Button
              variant="contained"
              sx={{ m: 1, width: "100px" }}
              onClick={sendEmail}
            >
              Verify
            </Button>
          </Stack>
        </CardContent>
      </Card>
      </Box>
      
    </Box>
  );
};

export default ChangePassword;
