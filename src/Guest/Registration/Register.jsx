import React, { useState } from "react";
import "./Register.css";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { auth, db } from "../../config/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [firstname, SetFirstname] = useState("");
  const [secondname, SetSecondname] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredentials.user.uid;
      console.log(uid);
  
      await setDoc(doc(db, "users", uid), {
        user_name: firstname + " " + secondname,
        user_email: email,
      });
    }
    catch(error){

 const errorcode=error.code;
 const errorMessage=error.message;
 if(errorcode === 'auth/email-already-in-use'){
  alert("You already have any Account")

 }
 else if(errorcode === "auth/weak-password"){
  alert("Weak password!Please try another one ")
 }
 console.log(errorMessage);
    }


    SetFirstname("");
    SetSecondname("");
    SetEmail("");
    SetPassword("");

  };




  return (
    <div className="register">

    
    
      <Box sx={{marginRight:'30px',marginBottom:'100px', borderLeft:'6px solid black', borderRadius:'1',padding:'3px'}}>

        <Typography variant="h1" sx={{fontWeight:'bold'}}>DConnect..</Typography>
        <Typography variant="h7" sx={{marginLeft:'6px'}}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quia, vitae.</Typography>
     </Box>
      
        <Card
          elevation={2}
          className="card-register"
          onSubmit={handleSubmit}
          component="form"
        >
          <Typography variant="h3" sx={{marginLeft:'100px'}}>Sign up</Typography>
          <Stack spacing={2} direction="row">
            <TextField
              id="standard-basic"
              label="First Name"
              variant="standard"
              value={firstname}
              onChange={(event) => SetFirstname(event.target.value)}
            />
            <TextField
              id="standard-basic"
              label="Second Name"
              variant="standard"
              value={secondname}
              onChange={(event) => SetSecondname(event.target.value)}
            />
          </Stack>

          <Stack spacing={5} direction="column">
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              value={email}
              onChange={(event) => SetEmail(event.target.value)}
            />
            <TextField
              id="standard-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="standard"
              value={password}
              onChange={(event) => SetPassword(event.target.value)}
            />
          </Stack>


          <Button variant="contained" sx={{ width: "400px" }} type="submit">
            Sign Up
          </Button>
        </Card>

      </div>
  
  );
};

export default Register;
