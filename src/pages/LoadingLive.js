import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";


function LoadingLive() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  React.useEffect(() => {
    setTimeout(()=> {
      navigate(`/live/${userName}`);
    },2000)
  },[])
  return (
    <>
      <div className="loading-wrap">
        <div className="loading-title">라이브 방송 준비 중입니다</div>
        <div className="loading-sub-title">방송 환경이 준비되기까지 잠시 기다려 주세요</div>


        <div className="spinner-wrap">
          <FadeLoader color={"#8A51FB"} size={10} />
        </div>
      </div>



    </>
  )
}

export default LoadingLive;