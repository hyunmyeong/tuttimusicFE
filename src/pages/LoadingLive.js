import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";


function LoadingLive() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  React.useEffect(() => {
    // setTimeout(()=> {
    //   navigate(`/live/${userName}`);
    // },2000)
  },[])
  return (
    <>
      <div className="loading-wrap">
        <div className="loading-title">라이브 방송 준비 중입니다</div>


        <div className="spinner-wrap">
          <FadeLoader color={"grey"} size={10} />
        </div>
      </div>



    </>
  )
}

export default LoadingLive;