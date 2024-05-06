import React, { useEffect, useState } from 'react'
import {Table,TableContainer,TableCell,TableRow,TableBody,Box,Typography,Avatar,CardMedia } from '@mui/material'
import { collection, getDocs,query, where } from 'firebase/firestore';
import { db } from '../../../config/FireBase';

const Notifications = () => {
  const [data, SetData] = useState([]);
  const [postpic,setCheckpostpic]=useState("")
  const fetchData = async () => {
    const uid = sessionStorage.getItem("uid");
    console.log(uid);


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
    const queryCom = query(commentRef,where("user_id",'!=',uid) )
    const commentD = await getDocs(queryCom)
    const commentData = commentD.docs.map((doc)=>({
      id:doc.id,
      uid:uid,
      timestamp: doc.data().comment_time, // Use comment_time field for timestamp
      type:"comments",
      ...doc.data()
    }))
    console.log(commentData);

    const posts= await getDocs(collection(db,"Posts"))
    const postdata= posts.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))

    const userDetails = await getDocs(collection(db, "users"));
    const userDetailsData = userDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));


    // Merge likes and comments data
  const mergedData = [...likesData, ...commentData];

  console.log(mergedData);


    // Sort merged data based on timestamp
  mergedData.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());



  const joinedData = mergedData.map((item) => {

    const userInfo = userDetailsData.find((user) => user.id === item.user_id);
    const PostInfo = postdata.find((post)=>post.id === item.post_id)

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
      PostInfo:PostInfo
    };
  })
  .filter((item)=>item.uid == item.post_userid)

    SetData(joinedData);
    console.log(joinedData);

    if("post_photo" in data){
      setCheckpostpic(true)
    }
    else{
      setCheckpostpic(false);
    }
  };


  useEffect(() => {
    fetchData();
 
  }, []);


  return (
 <Box>
  {data == "" && <Box sx={{display:'flex',alignItems:"center",justifyContent:"center"}}>No Notifications</Box>}
  {data != "" ?  
  
  <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>

          {data.map((row,key)=>(

<TableRow
sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
key={key}
>
<TableCell >
  <Box sx={{display:"flex",justifyContent:'space-between'}}>
  <Box sx={{display:"flex",alignItems:"center",gap:1}}>
    <Avatar src={row.userInfo.user_profilepic}/>
    <Box sx={{display:"flex",alignItems:"center",gap:1}}>
    <Typography sx={{fontWeight:"bold"}}>{row.userInfo.user_name}</Typography>
    <Typography>{row.type == "likes" ? "liked on your post ." : "commented on your post ."  }</Typography>
    
    <Typography sx={{ml:1,fontSize:"13px",color:"grey"}}>{row.formattedTimeDifference}</Typography>
    </Box>
  </Box>
  <Box>
    {postpic ?
    <CardMedia 
 image={row.PostInfo.post_photo}
 alt="jh"
 sx={{width:"70px",height:"80px",borderRadius:"10px",border:"1px solid grey"}}/> : ""}
 
  </Box>
  </Box>
</TableCell>
</TableRow>
          ))}
      
        </TableBody>
      </Table>
    </TableContainer>
  
  
  
  
  :

""
  
  
 
  }
    

 </Box>
  )
}

export default Notifications