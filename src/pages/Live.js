import React, { useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";

import Streamer from '../elements/Streamer';
import Subscribers from '../elements/Subscribers';
import Chatbox from "../elements/Chatbox";
import {usePrompt} from '../elements/Blocker';

import NotFound from "./NotFound";
import SEO from '../components/SEO';

function Live() {
  

  const navigate = useNavigate();

  //PARAMS=STREAMER'S NAME
  let params = useParams();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activate, setActivate] = useState(true);
  const [message, setMessage] = useState("현재 페이지를 벗어나면 라이브가 종료됩니다. 😭");

  const userProfileUrl = localStorage.getItem("userProfileUrl");
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  useEffect(()=>{
    setLoading(true);

    axios
    .get(`https://seyeolpersonnal.shop/chatRoom/${params.artist}`, {
      headers: {Authorization:token? token:""}
    })
    .then((response)=>{
      setData(response.data.liveRoomListDto);
      if(params.artist!==userName) {
      setMessage("정말 라이브 방을 나가시겠어요? 😭")
      }
    })
    .catch((error)=>{

    })

    setTimeout(()=> {
      setLoading(false);
    },300)
    window.scrollTo(0,0);

  },[])
  

  usePrompt(message, true);

  if (!localStorage.getItem("token")) {
    return (
      <NotFound/>
    )
  }

  console.log(params.artist)

  return (
  <div className="live-wrap">  
  <SEO pageTitle={"live"}/>
  {loading? (
      <div className="spinner-wrap">
        <BeatLoader color={"grey"} loading={loading} size={10}/>
      </div>
    ):(
      <div className="live-box">
      <div className="live-box-left">
        <div className="live-view">
          {data?.artist===userName?
          <Streamer session={`session${data.id}`} streamer={data.artist}/>
          :
          <Subscribers session={`session${data.id}`} subscriber={userName}/>
          }         
          
        </div>
        <div className="live-info">
        <img 
        id="live-info-image"
        src={data.profileImageUrl}
        alt={data.artist}
        />
          <div className="live-info-user">
            <div id="live-info-user-name">
            <a
            href={`/userpage/${data.artist}`}
            target="_blank"
            rel="noopener noreferrer">{data.artist}</a>
            </div>
            <div id="live-user-live">LIVE</div>
          </div>
          <div className="live-info-title">
            <div id="live-info-title-main">{data.roomTitle}</div>
            <div id="live-info-title-sub">{data.description}</div>
          </div>
        </div>
        </div>
        <div className="live-box-right">
        <div className="live-chat">
            <Chatbox streamer={data.artist} session={`session${data.id}`} subscriber={userName} userProfileUrl={userProfileUrl} />
         </div>   
      </div>

      </div>
    )}    
    
      
    </div>
  )
}


export default Live;