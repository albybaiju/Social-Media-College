// // import React, { useState } from "react";
// import "./Register.css";
// import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
// import { auth, db } from "../../config/FireBase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { addDoc, doc, setDoc } from "firebase/firestore";
// import { Link, useNavigate } from "react-router-dom";

// const Register = () => {
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isValidEmail, setIsValidEmail] = useState(true);

//   const handleEmailChange = (event) => {
//     const { value } = event.target;
//     setEmail(value);
//     setIsValidEmail(/^[a-zA-Z0-9._%+-]+@dcschool\.net$/.test(value) || value === ''); // Allow empty value
//   };

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (confirmPassword !== password) {
//       alert("Passwords do not match.");
//       return;
//     }

//     try {
//       const userCredentials = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const uid = userCredentials.user.uid;

//       await setDoc(doc(db, "users", uid), {
//         user_name: `${firstName} ${lastName}`,
//         user_email: email,
//       });

//       sessionStorage.setItem("uid", uid);
//       navigate("../SetProfileB");
//     } catch (error) {
//       const errorCode = error.code;
//       const errorMessage = error.message;

//       if (errorCode === "auth/email-already-in-use") {
//         alert("An account with this email already exists.");
//       } else if (errorCode === "auth/weak-password") {
//         alert("Weak password! Please use a stronger one.");
//       } else {
//         console.error(errorMessage);
//       }
//     }

//     // Clear form fields after submission
//     setFirstName("");
//     setLastName("");
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//   };

//   return (
//     <div className="register">
//       <Box sx={{ marginRight: '30px', marginBottom: '100px', borderRadius: '1', padding: '3px' }}>
//         <img src="Imags\dccc.png" style={{ width: "400px", height: "400px" }} alt="DC School Logo" />
//       </Box>

//       <Card elevation={2} className="card-register" component="form" onSubmit={handleSubmit}>
//         <Typography variant="h3" sx={{ marginLeft: '100px' }}>Sign up</Typography>

//         <Stack spacing={2} direction="row">
//           <TextField
//             label="First Name"
//             variant="standard"
//             value={firstName}
//             onChange={(event) => setFirstName(event.target.value)}
//             required
//           />
//           <TextField
//             label="Last Name"
//             variant="standard"
//             value={lastName}
//             onChange={(event) => setLastName(event.target.value)}
//             required
//           />
//         </Stack>

//         <Stack spacing={5} direction="column">
//           <TextField
//             label="Email"
//             variant="standard"
//             onChange={handleEmailChange}
//             error={!isValidEmail}
//             helperText={!isValidEmail && "Email must end with @dcschool.net"}
//             required
//           />
//           <TextField
//             label="Password"
//             type="password"
//             autoComplete="current-password"
//             variant="standard"
//             value={password}
//             onChange={(event) => setPassword(event.target.value)}
//             required
//           />
//           <TextField
//             label="Confirm Password"
//             type="password"
//             autoComplete="current-password"
//             variant="standard"
//             value={confirmPassword}
//             onChange={(event) => setConfirmPassword(event.target.value)}
//             required
//           />
//         </Stack>

//         <Button variant="contained" sx={{ width: "400px" }} type="submit">Sign Up</Button>

//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column", mt: 10 }}>
//           <Link to="/">
//             <Typography sx={{ fontWeight: "bold" }}>Already have an account?</Typography>
//           </Link>
//         </Box>
//       </Card>
//     </div>
//   );
// };

// export default Register;



import React, { useState } from "react";
import "./Register.css";
import { Box, Button, Card, Stack, TextField, Typography } from "@mui/material";
import { auth, db } from "../../config/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
    setIsValidEmail(/^[a-zA-Z0-9._%+-]+@dcschool\.net$/.test(value) || value === ''); // Allow empty value
  };

  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmPassword !== password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const usernamelowered = (firstName+lastName).toLowerCase()

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredentials.user.uid;

      await setDoc(doc(db, "users", uid), {
        user_name: `${firstName} ${lastName}`,
        user_email: email,
        user_nameLower:usernamelowered,
      });

      sessionStorage.setItem("uid", uid);
      navigate("../SetProfileB");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        alert("An account with this email already exists.");
      } else if (errorCode === "auth/weak-password") {
        alert("Weak password! Please use a stronger one.");
      } else {
        console.error(errorMessage);
      }
    }

    // Clear form fields after submission
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="register">
      <Box sx={{ marginRight: '30px', marginBottom: '100px', borderRadius: '1', padding: '3px' }}>
        <img src="Imags\dccc.png" style={{ width: "400px", height: "400px" }} alt="DC School Logo" />
      </Box>

      <Card elevation={2} className="card-register" component="form" onSubmit={handleSubmit}>
        <Typography variant="h3" sx={{ marginLeft: '100px' }}>Sign up</Typography>

        <Stack spacing={2} direction="row">
          <TextField
            label="First Name"
            variant="standard"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
          <TextField
            label="Last Name"
            variant="standard"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </Stack>

        <Stack spacing={5} direction="column">
          <TextField
            label="Email"
            variant="standard"
            onChange={handleEmailChange}
            error={!isValidEmail}
            helperText={!isValidEmail && "Email must end with @dcschool.net"}
            required
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            variant="standard"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </Stack>

        <Button variant="contained" sx={{ width: "400px" }} type="submit">Sign Up</Button>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column", mt: 10 }}>
          <Link to="/">
            <Typography sx={{ fontWeight: "bold" }}>Already have an account?</Typography>
          </Link>
        </Box>
      </Card>
    </div>
  );
};

export default Register;
