import React, { useEffect, useState } from "react";
import "./rightbar.css";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../config/FireBase";

const Rightbar = () => {
  const [posts, SetPost] = useState([]);

  const fetchData = async () => {
    const uid= sessionStorage.getItem('uid')
    const postRef = collection(db, "Posts");
    const q = query(
      postRef,
      orderBy("user_id"),
      orderBy("post_time", "desc"),
      limit(3),
      where("user_id", "!=", uid)
    );
        const qData = await getDocs(q);
    const querySnapshotData = qData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const userDetails = await getDocs(collection(db, "users"));
    const userDetailsData = userDetails.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const joinedData = querySnapshotData
      .map((post) => {
        const userInfo = userDetailsData.find(
          (user) => user.id === post.user_id
        );
        // Calculate time difference
        const currentTime = new Date();
        const uploadedTime = post.post_time.toDate(); // Assuming 'timestamp' is the field storing the upload time

        const timeDifferenceInMillis = currentTime - uploadedTime;

        // Convert the time difference to a readable format
        const secondsDifference = Math.floor(timeDifferenceInMillis / 1000);
        const minutesDifference = Math.floor(secondsDifference / 60);
        const hoursDifference = Math.floor(minutesDifference / 60);
        const daysDifference = Math.floor(hoursDifference / 24);

        let formattedTimeDifference;

        if (daysDifference >= 7) {
          // If more than 7 days, show only the date
          formattedTimeDifference = uploadedTime.toDateString();
        } else if (hoursDifference >= 24) {
          // If more than 24 hours, show only in days
          formattedTimeDifference = `${daysDifference}d ago`;
        } else if (minutesDifference >= 60) {
          // If more than 60 minutes, show only in hours
          formattedTimeDifference = `${hoursDifference}h ago`;
        } else if (secondsDifference >= 60) {
          // If more than 60 seconds, show only in minutes
          formattedTimeDifference = `${minutesDifference} minutes ago`;
        } else {
          formattedTimeDifference = `${secondsDifference}s ago`;
        }

        // Add the formatted time difference to the post object
        return {
          ...post,
          userInfo: userInfo,
          formattedTimeDifference: formattedTimeDifference,
        };
      })
      .filter((post) => post.user_id !== uid && !post.club_id);

    SetPost(joinedData);
    console.log(joinedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="rightbar">
      <div className="container">
        {/* <div className="itemr">
          <span style={{ color: "grey" }}>Suggestions for you</span>

          <div className="ruser">
            <div className="userinfo">
              <img src="" alt="ee" className="imgo" />
              <span>DCollege</span>
            </div>
            <div className="buttonr">
              <button className="buttonfd">follow</button>
              <button className="buttonfd">dismiss</button>
            </div>
          </div>

          <div className="ruser">
            <div className="userinfo">
              <img src="" alt="ee" className="imgo" />
              <span>DCollege</span>
            </div>
            <div className="buttonr">
              <button className="buttonfd">follow</button>
              <button className="buttonfd">dismiss</button>
            </div>
          </div>
        </div> */}
        <div className="itemr">
          <span style={{ color: "grey" }}>Latest Activiteies</span>
          {posts.map((row, key) => (
            <div className="ruser" key={key}>
              <div className="userinfo">
                <img src={row.userInfo.user_profilepic} alt="" className="imgo" />
                <p className="p">
                  <span className="span">{row.userInfo.user_name}</span> added new post
                </p>
              </div>
              <p>
                <span style={{ color: "grey", fontSize: "13px" }}>
                {row.formattedTimeDifference}
                </span>
              </p>
            </div>
          ))}
        </div>

        <div className="itemr">
          <span style={{ color: "grey" }}>Online</span>
          <div className="ruser">
            <div className="userinfo">
              <img
                src="https://th.bing.com/th/id/OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8?rs=1&pid=ImgDetMain"
                alt=""
                className="imgo"
              />
              <div className="online" />
              <span>Manu M</span>
            </div>
          </div>

          <div className="ruser">
            <div className="userinfo">
              <img
                src="https://th.bing.com/th/id/OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8?rs=1&pid=ImgDetMain"
                alt=""
                className="imgo"
              />
              <div className="online" />
              <span>Manu M</span>
            </div>
          </div>

          <div className="ruser">
            <div className="userinfo">
              <img
                src="https://th.bing.com/th/id/OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8?rs=1&pid=ImgDetMain"
                alt=""
                className="imgo"
              />
              <div className="online" />
              <span>Manu M</span>
            </div>
          </div>

          <div className="ruser">
            <div className="userinfo">
              <img
                src="https://th.bing.com/th/id/OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8?rs=1&pid=ImgDetMain"
                alt=""
                className="imgo"
              />
              <div className="online" />
              <span>Manu M</span>
            </div>
          </div>

          <div className="ruser">
            <div className="userinfo">
              <img
                src="https://th.bing.com/th/id/OIP.rvSWtRd_oPRTwDoTCmkP5gHaE8?rs=1&pid=ImgDetMain"
                alt=""
                className="imgo"
              />
              <div className="online" />
              <span>Manu M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
