import React, { useEffect, useState } from 'react'
import './sidebar.css'
import { Link,  useNavigate } from 'react-router-dom'
import { Avatar, Box, Button, Card, Typography } from '@mui/material'
import Groups2Icon from '@mui/icons-material/Groups2';
import Groups3Icon from '@mui/icons-material/Groups3';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LogoutIcon from '@mui/icons-material/Logout';
import {  doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/FireBase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
const Sidebar = () =>{

    const navigate = useNavigate()
    const [username,setUsername] = useState("")

    const uid=sessionStorage.getItem('uid')


    const handleLogout = () =>{
        sessionStorage.clear('uid')
       navigate("../../")
    }

    const userDetails = async() =>{
  
        const uid = sessionStorage.getItem('uid')
        const docRef = doc(db, "users", uid);
        const docSnap = (await getDoc(docRef)).data();
        setUsername(docSnap.user_name)
 
    }

    useEffect(()=>{
        userDetails()
    },[])

    return(
        <Card className='leftbar'>
            <Card className='container' elevation={0}>
                <div className='menu'>
                    <div className='user'>
                       <Avatar image="" />
                        <span>{username}</span>
                    </div>
               
                    <div className='item'>
                        <Link to='/User/MyClubs' style={{textDecoration:'none',display:"flex",gap:"10px"}}> 
                        <Groups3Icon/>
                        <span>My Clubs</span>
                        </Link>
                    </div>


                </div>
                <hr className='hr'/>
                <div className='menu'>
                    <span className='menuheaders'>Your shortcuts</span>

                
                    <div className='item'>
                        <Link to="/User/Clubuser/" style={{textDecoration:"none",display:"flex",gap:"10px"}}>
                        <Groups2Icon/>
                        <span> Join Clubs</span>
                        </Link>
                    </div>



                    <div className='item'>
                        <Link to='/User/Addpost' style={{textDecoration:"none",display:"flex",gap:"10px"}}> 
                        <AddAPhotoIcon sx={{fontSize:"18px"}}/>
                        <span style={{textDecoration:"none"}}>Add Post</span>
                        </Link>
                    </div>
                </div>

                <hr className='hr'/>
 
                <div className='menu'>
                    <span className='menuheaders'>others</span>

                    <Link to={`/User/Profile/${uid}`} style={{textDecoration:'none',color:"black"}}>
                    <Box sx={{display:'flex',alignItems:"center",m:1,gap:'5px'}}>
                    <AccountCircleIcon/>
                     <Typography>My Profile</Typography>
                    </Box>
                    </Link>
                    
                    <Link to="/User/Settings"style={{textDecoration:'none',color:"black"}}>
                    <Box sx={{display:'flex',alignItems:"center",m:1,gap:'5px'}}>
                    <SettingsIcon/>
                     <Typography>Settings</Typography>
                    </Box>
                    </Link>

                    <Box sx={{display:'flex',alignItems:"center",m:1}}>
                    <LogoutIcon/>
                        <Button
                           onClick={handleLogout}>
                            Logout
                            </Button>
                    </Box>





                    
                </div>
            

            </Card>

        </Card>
    )
}


export default Sidebar