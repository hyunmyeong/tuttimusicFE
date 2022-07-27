import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import '../styles/App.css';
import { useNavigate, useParams } from "react-router-dom";

import { FaYoutube } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';
import { BsPersonPlus, BsPersonCheck } from 'react-icons/bs';
import axios from 'axios';

import Tab1 from '../elements/Tab1';
import Tab2 from '../elements/Tab2';
import Tab3 from '../elements/Tab3';
import Tab4 from '../elements/Tab4';
import Tab5 from '../elements/Tab5';
import Tab6 from '../elements/Tab6';

import { useDispatch } from "react-redux";
import { followAnArtist } from "../redux/modules/songSlice"
import { style } from 'wavesurfer.js';
import SEO from '../components/SEO';

import { useMediaQuery } from "react-responsive";

function UserPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  

  const [tab, setTab] = useState(0);
  const [data, setData] = useState(null);

  const [likeVideoList, setLikeVideoList] = useState([]);
  const [uploadVideoList, setUploadVideoList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [likeList, setLikeList] = useState([]);
  const [uploadList, setUploadList] = useState([]);
  const [userInfoDto, setUserInfoDto] = useState([]);
  const [isFollow, setIsFollow] = useState(null);
  const [count, setCount] = useState(null);

  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const isMobile = useMediaQuery({
    query : "(max-width:480px)"
  })


  useEffect(()=>{
    setLoading(true);
    axios
    .get("https://seyeolpersonnal.shop/user/profile/"+params.artist, {
      headers: {Authorization:token? token:""}
    })
    .then((response)=>{
      console.log(response.data.data);
      setUploadVideoList(response.data.data.uploadVideoList)
      setLikeVideoList(response.data.data.likeVideoList)
      setFollowingList(response.data.data.followingList)
      setUploadList(response.data.data.uploadList)
      setUserInfoDto(response.data.data.userInfoDto)
      setLikeList(response.data.data.likeList)
      setIsFollow(response.data.isFollow)
      console.log(response.data.data.userInfoDto.followerCount)
      setCount(response.data.data.userInfoDto.followerCount)
    })
    .catch((error)=>{
      console.log(error)
    })

    setTimeout(()=> {
      setLoading(false);
    },500)
    window.scrollTo(0,0);
  },[params.artist])

  const FollowThisArtist =()=>{
    const data = {
      token: token,
      artist: userInfoDto.artist,
    }
    dispatch(followAnArtist(data));
    if (isFollow===false) {
      setCount(count+1)
    } else {
      setCount(count-1)
    }
    setIsFollow(!isFollow);

  }

  return (
    // Frame 61 전체 영역
    <div className='mypage-container'>
      <SEO pageTitle={"artist"}/>
      {/* Frame 59  회원정보 부분*/}

      {isMobile ?
        <>
          {/* imMobile true start */}
          <div className='mobile-mypage-header'>
            <div className='mobile-header-left'>

              <div className='mobile-header-profile-img-circle'>
                <img
                  className='mobile-header-porfile-img'
                  src={userInfoDto.profileImage}
                  alt={userInfoDto.artist} />
              </div>
              <div className='mobile-header-follow-container'>
                <div className='mobile-header-follow'>
                  <div className='mobile-follow-follower'>
                    <p>팔로워</p>
                  </div>
                  <div className='mobile-follow-follower-count'>
                    <p>{userInfoDto.followerCount}</p>
                  </div>
                </div>
                <div className='mobile-header-follow'>
                  <div className='mobile-follow-follower'>
                    <p>팔로잉</p>
                  </div>
                  <div className='mobile-follow-follower-count'>
                    <p>{userInfoDto.followingCount}</p>
                  </div>
                </div>


                {/* navigate 함수로 myedit 페이지로 갈 때, userInfoDto에 담아져있는 데이터를 state로 가져감 */}


              </div>
            </div>

            <div className='mobile-header-right'>
              <div className='mobile-header-artist'>
                <p className='mobile-header-artist-name'>{userInfoDto.artist}</p>
                <p className='mobile-header-artist-info'>{userInfoDto.profileText}
                <div className='header-sns'>
                  {userInfoDto.youtubeUrl ? <FaYoutube className='sns-icon sns-youtube' onClick={() => { window.open(userInfoDto.youtubeUrl) }} /> : null}
                  {userInfoDto.instagramUrl ? <RiInstagramFill className='sns-icon sns-instagram' onClick={() => { window.open(userInfoDto.instagramUrl) }} /> : null}
                </div>
                </p>
              </div>
              <div className='mobile-user-button'>
              <button 
            className='primary mobile-follow-follower-button'
            isFollow ={isFollow}
            onClick={()=>{
              FollowThisArtist()
            }}            
            >
            {isFollow===false?
            <div className='icon-separate'><BsPersonPlus className='follow-icon'/><p className='mobile-follow-follower-button-text'>팔로우</p></div>
            : <div className='icon-separate'><BsPersonCheck className='follow-icon'/><p className='mobile-follow-follower-button-text'>팔로잉</p></div>
            }
            </button>
            </div>
            </div>
          </div>
          {/* imMobile true end */}
        </>
        :
        <>
          {/* imMobile false start */}
          <div className='mypage-header'>

            <img
              className='header-porfile-img'
              src={userInfoDto.profileImage}
              alt={userInfoDto.artist} />

            <div className='header-profile-info'>
              <div className='header-artist'>
                <p className='header-artist-name'>{userInfoDto.artist}</p>
                <p className='header-artist-info'>{userInfoDto.profileText}</p>

                <div className='header-sns'>
                  {userInfoDto.youtubeUrl ? <FaYoutube className='sns-icon sns-youtube' onClick={() => { window.open(userInfoDto.youtubeUrl) }} /> : null}
                  {userInfoDto.instagramUrl ? <RiInstagramFill className='sns-icon sns-instagram' onClick={() => { window.open(userInfoDto.instagramUrl) }} /> : null}
                </div>
              </div>

              <div className='header-follow-container'>
                <div className='header-follow'>
                  <div className='follow-follower'>
                    <p>팔로워</p>
                  </div>
                  <div className='follow-follower-count'>
                    <p>{userInfoDto.followerCount}</p>
                  </div>
                  <div className='follow-follower'>
                    <p>팔로잉</p>
                  </div>
                  <div className='follow-follower-count'>
                    <p>{userInfoDto.followingCount}</p>
                  </div>
                </div>

                {/* navigate 함수로 myedit 페이지로 갈 때, userInfoDto에 담아져있는 데이터를 state로 가져감 */}
                <button 
            className='primary follow-follower-button'
            isFollow ={isFollow}
            onClick={()=>{
              FollowThisArtist()
            }}            
            >
            {isFollow===false?
            <div className='icon-separate'><BsPersonPlus className='follow-follower-icon'/><p className='follow-follower-button-text'>팔로우</p></div>
            : <div className='icon-separate'><BsPersonCheck className='follow-follower-icon'/><p className='follow-follower-button-text'>팔로잉</p></div>
            }
            </button>

              </div>

            </div>

          </div>
          {/* imMobile false end */}
        </>}


      <div className='mypage-body'>
        <div className='body-bar'>
            <P0 className='body-bar-menu' onClick={()=>{setTab(0)}} tab={tab}>전체</P0>
            <P1 className='body-bar-menu' onClick={()=>{setTab(1)}} tab={tab}>관심음악</P1>
            <P2 className='body-bar-menu' onClick={()=>{setTab(2)}} tab={tab}>관심영상</P2>
            <P3 className='body-bar-menu' onClick={()=>{setTab(3)}} tab={tab}>팔로잉</P3>
            <P4 className='body-bar-menu' onClick={()=>{setTab(4)}} tab={tab}>업로드음악</P4>
            <P5 className='body-bar-menu' onClick={()=>{setTab(5)}} tab={tab}>업로드영상</P5>
            {/* <TabContent tab={tab}/> */}
        </div> 

        <div className='body-contents'>
          {tab ===0?
          (<Tab1 followingList={followingList} likeList={likeList} uploadList={uploadList} likeVideoList={likeVideoList} uploadVideoList={uploadVideoList} />)
          :tab ===1?
          (<Tab2/>)
          :tab ===2?
          (<Tab3/>)
          :tab ===3?
          (<Tab4/>)
          :tab ===4?
          (<Tab5/>)
          :tab ===5?
          (<Tab6/>)
          : null
          }
        </div>
      </div>
    </div>
  )
}

export default UserPage;

const Button = styled.div`
  border: 1px solid black;
  display: inline;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  margin-left: 30px;
  
`


const P0= styled.div`
  padding: 15px 5px; 
  border-bottom: ${props => (props.tab===0 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===0 ? ' #8A51FB' : '#545454')};
`

const P1= styled.div`
  padding: 15px 5px; 
  border-bottom: ${props => (props.tab===1 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===1 ? ' #8A51FB' : '#545454')};
`

const P2= styled.div`
  padding:15px 5px; 
  border-bottom: ${props => (props.tab===2 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===2 ? ' #8A51FB' : '#545454')};
`

const P3= styled.div`
  padding: 15px 5px; 
  border-bottom: ${props => (props.tab===3 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===3 ? ' #8A51FB' : '#545454')};
`

const P4= styled.div`
  padding: 15px 5px;   
  border-bottom: ${props => (props.tab===4 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===4 ? ' #8A51FB' : '#545454')};
`

const P5= styled.div`
  padding:15px 5px; 
  border-bottom: ${props => (props.tab===5 ? '2px solid #8A51FB' : 'none')};
  color: ${props => (props.tab===5 ? ' #8A51FB' : '#545454')};
`

