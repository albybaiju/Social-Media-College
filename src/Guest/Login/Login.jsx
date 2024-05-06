import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Card, TextField, Typography,Box ,CardMedia} from "@mui/material";
import { auth, db } from "../../config/FireBase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      console.log(uid);

      const docRefUser = doc(db, "users", uid);
      const docSnapUser = await getDoc(docRefUser);

      const docRefAdmin = doc(db, "Admin", uid);
      const docSnapAdmin = await getDoc(docRefAdmin);

      if (docSnapUser.exists()) {
        sessionStorage.setItem("uid", uid);
        navigate("../../User");
      } else if (docSnapAdmin.exists()) {
        sessionStorage.setItem("aid", uid);
        navigate("../../Admin");
      } else {
        alert("invalid Credential");
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorCode);
      console.log(errorMessage);
    }
  };

  return (

 
   <Box sx={{display:"flex",}}>

        <Box sx={{width:"50%",display:"flex",alignItems:"center",flexDirection:"column",justifyContent:"center",mb:10,}}>
      
        <img style={{width:"400px",height:"400px"}} src="\Imags\dccc.png" alt="..."/>
       
     </Box>


    <Box sx={{display:'flex',justifyContent:"center",alignItems:"center",width:"50%",height:"100vh"}}>
  
      <Card
            component="form"
            elevation={3}
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 320,
              height: 480,
              gap: 4,
              pt:4,
              pl:10,
              pr:10,
              pb:9
           
            }}
          >
            <Box sx={{height:"100px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Typography variant="h3" sx={{mb:"10px"}}>Login</Typography>
            </Box>
            <Box sx={{display:"flex",flexDirection:"column",gap:1}}>
            <Typography sx={{fontSize:"18px"}}>Email</Typography>
            <input 
              type="text"
              value={email}
              style={{border:"2px solid gray",borderRadius:"5px",p:2,height:"40px",fontSize:"17px"}}
              onChange={(event) => setEmail(event.target.value)}
            />
            </Box> 

            <Box sx={{display:"flex",flexDirection:"column",gap:1}}>
            <Typography sx={{fontSize:"18px"}}>Password</Typography>  
            <input
              type="password"
              autoComplete="current-password"
              style={{border:"2px solid gray",borderRadius:"5px",p:2,height:"40px",fontSize:"17px"}}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            </Box>
          

            <Button variant="contained" type="submit" sx={{borderRadius:"20px"}}>
              Login
            </Button>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:"column",gap:10}}>
            <Link to="/Forgottpassword">
            <Typography>Forgotten password ?</Typography>
            </Link>
            <Link to="/Register" style={{textDecoration:"none",width:"100%"}}>
            <Button variant="outlined" sx={{width:"100%",borderRadius:"20px"}}>Create new account</Button>
            </Link>
            </Box>
          </Card>
    </Box>
   </Box>
  );
};

export default Login;
