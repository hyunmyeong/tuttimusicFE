import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";

import BeatLoader from "react-spinners/BeatLoader";


function Tab2() {

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

const [list, setList] = useState(null);

const token = localStorage.getItem("token");
const [loading, setLoading] = useState(true);


useEffect(()=>{

    setLoading(true);

    if (location.pathname === "/mypage") {
      axios
    .get("https://seyeolpersonnal.shop/user/mypage/hearts", {
        headers: {Authorization:token? token:""}
    })
    .then((response)=>{
        setList(response.data.data)
    })
    .catch((error)=>{
    })

    } else {
      axios
    .get("https://seyeolpersonnal.shop/user/profile/"+params.artist+"/hearts", {
        headers: {Authorization:token? token:""}
    })
    .then((response)=>{
        setList(response.data.data)
    })
    .catch((error)=>{
    })
  }


    setTimeout(()=> {
        setLoading(false);
    },500)
    window.scrollTo(0,0);
    },[])

    const SameName = (artist) => {
      if(artist === localStorage.getItem("userName")) {
        navigate("/mypage");
      } else {
        navigate(`/userpage/${artist}`);
      }
    }



    return( 
        <>
        {loading===true?
        <div className="spinner-wrap">
            <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>    
        :list&&list.length === 0 ? 
        <p className='no-content'>관심 음악이 없어요 😭</p>
        :
        <div className='tab-body'>
            {list&&list.map((song, Index)=>{
                return(
                    <div className='main-card tab-card'>
                        <img 
                        src={song.albumImageUrl} 
                        className='main-album-art'
                        alt={song.title}
                        onClick={() => {navigate(`/detail/${song.feedId}`)}}/>
                        <div className="main-card-text page-card-text">
                            <p className="main-card-title"
                            onClick={() => {navigate(`/detail/${song.feedId}`)}}>
                            {song.title}
                            </p>
                            <p className="main-card-artist"
                            onClick={() => SameName(song.artist)}>
                            {song.artist}
                            </p>
                        </div>
                    </div>
                    );
                })
            }
        </div>
        }
        
        </>
        )
    }

export default Tab2;