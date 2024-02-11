import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, TextField, Typography } from "@mui/material";
import { auth, db } from "../../config/FireBase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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
    <div className="login">
      <div className="card">
        <div className="left-login">
          <h1 className="h1">Hello world</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ducimus
            natus tempore. Laborum laboriosam odio, repudiandae cum ab sed
            expedita?
          </p>
          <span>Dont have an account?</span>
          <Link to="/Register">
            <button className="button">Register</button>
          </Link>
        </div>
        <div className="right-box-login">
          <Card
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: 300,
              height: 300,
              gap: 3,
              p: 10,
            }}
          >
            <Typography variant="h4">Login</Typography>
            <TextField
              id="standard-basic"
              label="Email"
              variant="standard"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              id="standard-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="standard"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button variant="contained" type="submit">
              Login
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
