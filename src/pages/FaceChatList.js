import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {SERVER_URL} from "../redux/modules/songSlice";
import BeatLoader from "react-spinners/BeatLoader";
import { BsBroadcast } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import SEO from '../components/SEO';

import Modal from '../elements/Modal';

function FaceChatList() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [roomList, setRoomList] = useState(null);

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    useEffect(()=>{
    setLoading(true);

    axios
    .get(`${SERVER_URL}/chatRoom`, {
    headers: {Authorization: token ? token : ""}
    })
    .then((response) => {
    setRoomList(response.data.results);
    
    window.scrollTo(0, 0);
    })
    .catch((error) => {
    });

    setTimeout(()=> {
        setLoading(false);
    },300)
    window.scrollTo(0,0);

    },[])


    const [alert, setAlert] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
          setModalOpen(true);
          };
    const closeModal = () => {
          setModalOpen(false);
          };
  
    const enterRoom=(params)=>{
      if (!token) {
        setAlert("로그인을 하고 입장해 주세요!");
        openModal();
      } else {
        navigate(`/live/`+params)
      } 
    }
    


    return(
        <div>
            <SEO pageTitle={window.location.pathname.substring(1)}/>
            <div className="facechat-list">
                <div className='facechat-header'>
                    <div className="facechat-list-title">
                        라이브 중인 채널
                    </div>

            {token ? 
            <button className='primary facechat-button btn' onClick={() => navigate("/createlive")}><BsBroadcast id="broadcast-icon" />라이브 시작하기</button> 
            : 
            null}

                </div>

                
                
                {loading? (
                <div className="spinner-wrap">
                    <BeatLoader color={"grey"} loading={loading} size={10}/>
                </div>
                ):(

                  <>
                  {roomList&&roomList.length === 0 ? 
  <div className="empty-live">🎤 현재 라이브 중인 방이 없네요 🎤 <br/>
                  라이브를 시작해 보세요! 
                  </div> : 
                                    <div className="facechat-list-container">
                                    <div className="facechat-live-list">
                                    {
                                    roomList?.map((live, index) => {
                                        return (
                                            <div 
                                            className="facechat-live-box"
                                            onClick={()=>{
                                                enterRoom(live.artist)
                                            }}
                                            >
                                                
                                                    <Live
                                                    id="live-info-user-live"
                                                    className='live-absolute'>
                                                        LIVE
                                                    </Live>
                                                    <div className="musicfeed-thumbnail-box facechat-card">
                                                    <img 
                                                    className='main-thumbnail musicfeed-thumbnail'
                                                    src={live.thumbnailImageUrl} 
                                                    alt={live.roomTitle}
                                                    />
                                                    </div>
                                                <div className="facechat-live-info">
                                                    <div className="facechat-live-pofileimg">
                                                        <img 
                                                        className='facechat-live-pofileimg'
                                                        src={live.profileImageUrl} 
                                                        alt={live.artist}
                                                        />
                                                    </div>
                                                    <div className="facechat-info-box">
                                                        <p className="facechat-info-title">{live.roomTitle}</p>
                                                        <p className="facechat-info-artist">{live.artist}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                    </div>
                                </div>  
                  }
                  </>
                
                )}            
            </div>
            <Modal open={modalOpen} close={closeModal} alert={alert}/>
        </div>
    )
}

export default FaceChatList;

const Live = styled.div`
    
`