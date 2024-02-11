import React  from "react";
import Sidebar from "./Components/Sidebar/sidebar";
import './homepage.css'
import Navbar from "./Components/Navbar/navbar";
import Widgets from "./Components/Widgets/Widgets";


const Home = () =>{

    return(
   <div className="homepage">
    <Sidebar/>
    <div className="homepagecontainer">
        <Navbar/>
        <div className="widgets">
            <Widgets type="users"/>
            <Widgets type="order"/>
            <Widgets type="earnings"/>
            <Widgets type="balance"/>

        </div>
    </div>
   </div>
    )


}



export default Home