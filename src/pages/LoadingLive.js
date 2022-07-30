import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector, useDispatch } from "react-redux";
import {checkSession} from "../redux/modules/videoSlice";

function LoadingLive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = localStorage.getItem("userName");
  const videoInfo = useSelector((state)=> state.Video.video);
  console.log(videoInfo)
  console.log(videoInfo.videoSession)
  const session = videoInfo.videoSession

  useEffect(() => {
    if (session===true) {
      navigate('/livelist')
      dispatch(checkSession(false))
    } else {
      setTimeout(()=> {
      navigate(`/live/${userName}`);
    },2000)
    }

    

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