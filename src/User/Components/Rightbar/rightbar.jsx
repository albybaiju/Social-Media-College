import React, { useEffect, useState } from "react";
import "./rightbar.css";
import { collection, query, where, getDocs, orderBy, endAt, startAt, limit } from "firebase/firestore";
import { db } from "../../../config/FireBase";
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
import SearchIcon from '@mui/icons-material/Search';
import { Link } from "react-router-dom";

const Rightbar = () => {
  const [data, SetData] = useState([]);
  const [searchvalue, setSearchvalue] = useState("");
  const[result,setResult]= useState([])
 console.log(searchvalue);

 const fetchSearchResults = async (searchvalue) => {
  try {
    const usersRef = collection(db, 'users');
    const searchValueLower = searchvalue.toLowerCase().replace(/\s/g, '');

    const q = query(usersRef, orderBy('user_nameLower'), startAt(searchValueLower), endAt(searchValueLower + '\uf8ff'));

    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({
id:doc.id,
...doc.data()
    
    }))

    setResult(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
};

const handleSearchChange = (e) => {
  setSearchvalue(e.target.value);
  fetchSearchResults(searchvalue);
};


 console.log(result);

  const fetchData = async () => {
    const uid = sessionStorage.getItem("uid");

    const likeRef = collection(db, "Likes");
    const q = query(likeRef, where("user_id", "!=", uid));
    const qData = await getDocs(q);
    const likesData = qData.docs.map((doc) => ({
      id: doc.id,
      uid:uid,
      timestamp: doc.data().like_time, // Use like_time field for timestamp
      type:"likes",
      ...doc.data(),
    }));

   console.log(data);
    
 const commentRef = collection(db,"Comments")
    const queryCom = query(commentRef,where("user_id",'!=',uid))
    const commentD = await getDocs(queryCom)
    const commentData = commentD.docs.map((doc)=>({
      id:doc.id,
      uid:uid,
      timestamp: doc.data().comment_time, // Use comment_time field for timestamp
      type:"comments",
      ...doc.data()
    }))
    console.log(commentData);

    const userDetails = await getDocs(collection(db, "users"));
    const userDetailsData = userDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    // Merge likes and comments data
  const mergedData = [...likesData, ...commentData];
  console.log(mergedData);

  console.log(mergedData);


    // Sort merged data based on timestamp
  mergedData.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());



  const joinedData = mergedData.map((item) => {

    const userInfo = userDetailsData.find((user) => user.id === item.user_id);

    // Calculate time difference
    const currentTime = new Date();
    const uploadedTime = item.timestamp.toDate();
    const timeDifferenceInMillis = currentTime - uploadedTime;
    const secondsDifference = Math.floor(timeDifferenceInMillis / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
    let formattedTimeDifference;

    if (daysDifference >= 7) {
      formattedTimeDifference = uploadedTime.toDateString();
    } else if (hoursDifference >= 24) {
      formattedTimeDifference = `${daysDifference}d ago`;
    } else if (minutesDifference >= 60) {
      formattedTimeDifference = `${hoursDifference}h ago`;
    } else if (secondsDifference >= 60) {
      formattedTimeDifference = `${minutesDifference} minutes ago`;
    } else {
      formattedTimeDifference = `${secondsDifference}s ago`;
    }

    return {
      ...item,
      userInfo: userInfo,
      formattedTimeDifference: formattedTimeDifference,
    };
  })
  .filter((item)=>item.uid == item.post_userid)

    SetData(joinedData);
    console.log(joinedData);
  };


  useEffect(() => {
    fetchData();
 
  }, []);

  return (
    <Box sx={{position:"sticky",top:1,borderLeft: "1px solid #E0DFDE"}}>
      <Box sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: "400px",
          }}
        >

    <Box sx={{p:3, borderTop:"1px grey",height:"60px"}}>
    <Box sx={{
        pl: 2,
        display:"flex",
        justifyContent:"center",
      }}>

    <input type="text" id="standard-basic" placeholder="Search" style={{
          
          width: '320px',
          height:"30px",
          border:"1px solid grey",
          borderRadius:"10px",
         paddingLeft:"30px",
         paddingRight:"10px",
          fontSize:"15px",
          position:"relative"
        }}
        value={searchvalue}
     onChange={handleSearchChange}
         />
         <SearchIcon sx={{position:"absolute",    top: '30px',
    left: '45px'}}/>
        </Box>
          {searchvalue != 0 ? 
            <Card className="search-card">
              {result.map((row,key)=>(
                   
                  <Box key={key} className="search-user-box">
               <Link
                    to={`/User/Profile/${row.id}`}
                    style={{ textDecoration: "none", color: "black",display:"flex",alignItems:"center",gap:2 }}
                  >
                  <Avatar src={row.user_profilepic}/>
                  <Typography>{row.user_name}</Typography>
                  </Link>
                </Box>

              ))}
            </Card>
        : <></>}
    </Box>


    <Typography
            sx={{ mt: 18, ml: 5, fontWeight: "bold", fontSize: "19px",  }}
          >
            Notifications
          </Typography>

    {data != "" ?
    
    
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Card
      sx={{
        m: 1,
        display: "flex",
        flexDirection: "column",
        p: 2,
        alignItems: "center",
        gap: 2,
        width: "330px",
      }}
    >
      
      {data.map((row, key) => (
        <Box
        key={key}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Avatar sx={{ width: "35px", height: "35px" }} src={row.userInfo.user_profilepic}/>
            <Typography sx={{fontSize:"14px",fontWeight:"bold"}}>{row.userInfo.user_name}</Typography>
            <Typography sx={{fontSize:"14px"}}> {row.type === "likes" ? "liked your post" :  "comment on your post"}</Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: "13px", color: "GrayText" }}>
            {row.formattedTimeDifference}
            </Typography>
          </Box>
        </Box>
      ))}
    </Card> 
   </Box> 
    
    
    : <Typography sx={{m:14,color:"GrayText"}}>No Notifications</Typography>}

         

        </Box>
      </Box>
    </Box>
  );
};

export default Rightbar;
