import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Dialog ,
  DialogTitle,
  DialogActions,
  DialogContent,
  Avatar
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Style.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "@emotion/styled";
import { addDoc, collection, doc, endAt, getDoc, getDocs, orderBy, query, startAt, where } from "firebase/firestore";
import { db, storage } from "../config/FireBase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './Style.css'

export const Club = () => {
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



  const [name, SetName] = useState("");
  const [category, SetCategory] = useState("");
  const [motto, SetMotto] = useState("");
  const [chairman, SetChairman] = useState("");
  const [photo, setPhoto] = useState([]);
  const [showcat, setShowCat] = useState([]);
  const [showusers, SetShowusers] = useState([]);
  const [admin, SetAdmin] = useState("");
  const [departs, SetDeparts] = useState([]);
  const [open, setOpen] = useState("");
 const [searchvalue,setSearchvalue]=useState("")
 const[result,setResult]=useState([])
 const [adname, SetAdminname] = useState("");
 const [proadmin, SetAdminProfile] = useState("");
 const [adp, setAdminPresent] = useState(false);
 const[dep,SetDepartment]=useState('')
 const [currPhoto, setcurrentPhoto] = useState(""); 

 const selectPhoto = async (e) => {
  const photo = e.target.files[0];
  setPhoto(photo);
  const reader = new FileReader();
  reader.onload = function (e) {
    setcurrentPhoto(e.target.result);
  };
  reader.readAsDataURL(photo);
};

 const fetchUsers = async (searchvalue) => {

  try {
    const usersRef = collection(db, 'users');
    const searchValueLower = searchvalue.toLowerCase().replace(/\s/g, '');

    const q = query(usersRef, orderBy('user_nameLower'), startAt(searchValueLower), endAt(searchValueLower + '\uf8ff'));

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
       id:doc.id,
     ...doc.data()
    }));

    setResult(results);
    console.log(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }

};

const handleClose = async (id) => {
  setOpen(false);
  SetAdmin(id)
  const usersRef = doc(db, 'users',id);
  const DocSnap = (await getDoc(usersRef)).data();
  SetAdminname(DocSnap.user_name)
  SetAdminProfile(DocSnap.user_profilepic)
  setAdminPresent(true)

};


const handleclosed = () =>{
  setOpen(false)
}

    

  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
const handlesearch = (e)=>{

setSearchvalue(e.target.value)
fetchUsers(searchvalue)

}

  const fetchDepartments = async () => {
    const querydeparts = await getDocs(collection(db, "Departments"));
    const querdep = querydeparts.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    SetDeparts(querdep);
  };


  const fetchcat = async () => {
    const querycat = await getDocs(collection(db, "Category"));
    const quercatData = querycat.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setShowCat(quercatData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = ref(storage, "images/" + photo.name);
    await uploadBytesResumable(storageRef, photo, metadata);
    const url = await getDownloadURL(storageRef).then((downloadURL) => {
      return downloadURL;
    });

     await addDoc(collection(db, "Clubs"), {
      club_name: name,
      club_motto: motto,
      club_photo: url,
      club_department:dep,
      club_category: category,
      club_admin :admin,
    });
    alert("Data Succesfully Uploaded")

    SetName("");
    SetCategory("");
    SetMotto("");
    setPhoto("");
    SetAdmin("")
    SetDepartment("")
    setAdminPresent(false)
    
  };



  useEffect(() => {
    fetchcat();
    fetchUsers();
    fetchDepartments()
  }, []);

  return (
    <Box className="box">
      <Card
        className="card-club"
        elevation={3}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h3"
          sx={{ marginLeft: "90px", fontWeight: "bold" }}
        >
          Add Club
        </Typography>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "30px",
          }}
        >
          <Box sx={{display:"flex",alignItems:'center',flexDirection:"column",gap:1}}>
          <Avatar   src={currPhoto} sx={{width:'70px',height:'70px'}}/>
          <Button
              component="label"
              variant="contained"
              sx={{ width: "130px" }}
            >
           Profile Pic
              <VisuallyHiddenInput type="file"  onChange={selectPhoto} />
            </Button>


          </Box>
         
          <TextField
            id="standard-basic"
            label="Club Name"
            variant="standard"
            className="text-club"
            sx={{ width: "330px" }}
            value={name}
            onChange={(e) => SetName(e.target.value)}
          />
          <Stack spacing={3} direction="row">
            <FormControl variant="standard" sx={{width:"160px"}}>
              <InputLabel id="demo-simple-select-standard-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Category"
                value={category}
                onChange={(e) => SetCategory(e.target.value)}
              >
                {showcat.map((row, key) => (
                  <MenuItem key={key} value={row.id}>
                    {row.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          
            <FormControl variant="standard" sx={{width:"160px"}}>
              <InputLabel id="demo-simple-select-standard-label">
                Department
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Category"
                value={dep}
                onChange={(e) => SetDepartment(e.target.value)}
              >
                {departs.map((row, key) => (
                  <MenuItem key={key} value={row.id}>
                    {row.department}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          

    
          </Stack>

          <TextField
          id="standard-multiline-flexible"
          label="Club Motto"
          multiline
          maxRows={4}
          variant="standard"
          sx={{ width: "330px" }}
          value={motto}
          onChange={(e) => SetMotto(e.target.value)}
        />

 

          {adp ? <Card sx={{display:'flex',alignItems:"center",p:2,height:20}}>
                
                    <Avatar src={proadmin}/>
                    <Typography>{adname}</Typography>

          </Card>:""}

<Button onClick={handleClickOpen}>Set the Admin</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleclosed}>
        <DialogTitle sx={{ml:20}}>Select a User</DialogTitle>
        <DialogContent>
        <Box sx={{width:"400px",height:"300px",display:"flex",flexDirection:"column",border:"2px solid grey",borderRadius:"10px",gap:2,p:3}}>
        <TextField id="standard-basic" label="Search" variant="standard" onChange={handlesearch} />
      <Box>
        {searchvalue != 0 ? 
          <Card className="search-card-ad">
            {result.map((row,key)=>(
                <Button variant="outlined" key={key} className="search-user-box-ad" onClick={()=>handleClose(row.id)}>
                <Avatar src={row.user_profilepic}/>
                <Typography>{row.user_name}</Typography>
              </Button>

            ))}
          </Card>
      : <></>}


        </Box>
        

        </Box>
        </DialogContent>
      </Dialog>
{/* 
          <FormControl variant="standard" sx={{width:'330px'}}>
            <InputLabel id="demo-simple-select-standard-label">
              Admin
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Age"
              value={admin}
              onChange={(e)=>SetAdmin(e.target.value)}
            >
              {showusers.map((row, key) => (
                <MenuItem key={key} value={row.id}>
                  <Box sx={{display:'flex',alignItems:'center',gap:'10px',width:'98%',borderRadius:'30px'}}>
                  <AccountCircleIcon/>
                  {row.user_name}
                  </Box>
                 
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <Button variant="contained" sx={{ width: "90%" }} type="submit">
            SUBMIT
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Club;
