import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { slidesOnLeft } from 'react-slick/lib/utils/innerSliderUtils';

import BeatLoader from "react-spinners/BeatLoader";


function Tab4() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

    const [list, setList] = useState([]);

    const token = localStorage.getItem("token");

    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        setLoading(true);

        if (location.pathname === "/mypage") {
          axios
        .get("https://seyeolpersonnal.shop/user/mypage/follows", {
            headers: {Authorization:token? token:""}
        })
        .then((response)=>{
            setList(response.data.data)
        })
        .catch((error)=>{
        })
    
        } else {
          axios
        .get("https://seyeolpersonnal.shop/user/profile/"+params.artist+"/follows", {
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


    return( 
        <>
        {loading===true?
        <div className="spinner-wrap">
            <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>  
        :list&&list.length === 0 ? 
        <p className='no-content'>팔로잉하는 아티스트가 없어요 😭</p>
        : 
        <div className='tab-body tab-following-body'>
        {list&&list.map((song, Index)=>{
            return(
                <div className='body-following-card'
                onClick={() => {navigate(`/userpage/${song.artist}`)}}>
                    <img 
                    src={song.profileImage} 
                    className='body-circle'
                    alt={song.artist}/>
                    <p className='body-title'>{song.artist}</p>            
                </div>
                )
            })}
        </div>
        } 
        </>
        )
}

export default Tab4;