import React, { useEffect, useState, useRef, useMemo} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {getSongDetail,postComment, SERVER_URL, likeSong} from "../redux/modules/songSlice"
import BeatLoader from "react-spinners/BeatLoader";
import moment from "moment";
import Waveform from '../elements/Waveform';
import EditComment from "../elements/EditComment";
import EditDelete from "../elements/EditDelete";
import { useMediaQuery } from "react-responsive";
import SEO from '../components/SEO';

function Detail() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let params = useParams();

  
  const isMobile = useMediaQuery({
    query : "(max-width:480px)"
  })

  const currentTime = moment().format()

  useEffect(()=>{
  const token = localStorage.getItem("token");
  setToken(token);
  setLoading(true);
  const propslist={
    token: token,
    id: params.id,
  }
  dispatch(getSongDetail(propslist));
  setTimeout(()=> {
    setLoading(false);
  },300)
  window.scrollTo(0,0);
},[])

  //get lists from songslice
  const detail = useSelector((state)=> state.Song.detail);
  const commentsList = useSelector((state)=> state.Song.comments);
  

  //get user info from local storage
  const userName = localStorage.getItem("userName");
  const userProfileUrl = localStorage.getItem("userProfileUrl");
  
  //add a comment
  const [myComment, setMyComment] = useState(null);
  

  const addNewComment = () => {
    dispatch(postComment({
    artist: userName,
    profileUrl: userProfileUrl,
    comment: myComment,
    token: token,
    feedid: detail.id,
    modifiedAt: currentTime,
    }));
    
  }


  const ClickEmptyHeart =()=>{
    dispatch(likeSong({
      token: token,
      feedid: detail.id,
      likeCount: detail.likeCount,
      isLiked:detail.flag,
    }))
  }

  const ClickFilledHeart =()=>{
    dispatch(likeSong({
      token: token,
      feedid: detail.id,
      likeCount: detail.likeCount,
      isLiked:detail.flag,
    }))
  }

  //description 
  const commenter = detail?.description

  const [show, setShow] = useState(false);
  const textLimit = useRef(100);

  const showText = useMemo(() => {
    const shortText = commenter?.slice(0, textLimit.current);

    if(commenter?.length > textLimit.current) {
      if (show) {return commenter}
      return shortText
    }
    return commenter;
  })

  const SameName = (artist) => {
    if(artist === localStorage.getItem("userName")) {
      navigate("/mypage");
    } else {
      navigate(`/userpage/${artist}`);
    }
  }


  
  return (
    <div className="detail-container">
      <SEO pageTitle={"Song"}/>
      {isMobile ? 
      <>
      {/* isMobile true start */}

      {/* MUSIC DETAIL AREA */}      
      {loading? (
        <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
      ):(
      <>
        <section className="music-detail">
            <img
            className="detail-album-art" 
            alt="better off alone"
            src={detail.albumImageUrl}
            />
          
    
          <div className="detail-info-wrap">
            <div className="flex-wrap between">
              <p className="detail-info-title">{detail.title}</p>
              <p className="detial-genre genre-color">{detail.genre}</p>
            </div> 
            <div className="flex-wrap">
              {userName === detail.artist ?  
              <EditDelete detail={detail} token={token} id={params.id}/>
              : null}
            </div>
          </div>
            <Waveform 
              songUrl={detail.songUrl} 
              title={detail.title}
              detail={detail}
              token={token}
              loading={loading}
              />
              
          <div 
            className="detail-artist-profile"
            onClick={()=>SameName(detail.artist)}>
              <img 
              className="detail-artist-img"
              alt={detail.artist}
              src={detail.profileUrl}
              />
              <p className="detail-artist">
              {detail.artist}
              </p>
            </div>
            
            
            <p className="detail-song-detail">
              {showText}
            </p>
            <p className="detail-more-detail" onClick={()=> setShow(!show)}>
              {(commenter.length > textLimit.current) && (show ? '[닫기]' : '...[더보기]')}
            </p>
            
       
        </section>
      </>

      )}
      {/* isMobile true end */}
      </> 
      : 
      <>
       {/* isMobile false start */}
       {/* MUSIC DETAIL AREA */}      
      {loading? (
        <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
      ):(
      <>
        <section className="music-detail">
        
        
          <div className="left-column">
            <img
            className="detail-album-art" 
            alt="better off alone"
            src={detail.albumImageUrl}
            />
            <div 
            className="detail-artist-profile"
            onClick={()=>SameName(detail.artist)}>
              <img 
              className="detail-artist-img"
              alt={detail.artist}
              src={detail.profileUrl}
              />
              <p className="detail-artist">
              {detail.artist}
              </p>
            </div>
          </div>
          <div className="right-column">
          <div className="detail-info-wrap">
            <div className="flex-wrap between">
              <p className="detail-info-title">{detail.title}</p>
              <p className="detial-genre genre-color">{detail.genre}</p>
            </div> 
            <div className="flex-wrap">
              {userName === detail.artist ?  
              <EditDelete detail={detail} token={token} id={params.id}/>
              : null}
            </div>
          </div>
            <Waveform 
              songUrl={detail.songUrl} 
              title={detail.title}
              detail={detail}
              token={token}
              loading={loading}/>
            

            
            <p className="detail-song-detail">
              {showText}
            </p>
            <p className="detail-more-detail" onClick={()=> setShow(!show)}>
              {(commenter.length > textLimit.current) && (show ? '닫기' : '...더보기')}
            </p>
            
          </div>
        </section>
      </>

      )}
       {/* isMobile false end */}
      </>}

        <div className="divider"></div>
{/* COMMENT AREA */}
      {loading? (
        <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
      ):(
        <section className="music-comment">
          <p className="detail-comment-title" >
          댓글 <span className="spangrey">{commentsList&&commentsList.length}</span>
          </p> 

          <div className="comment-input-wrap">
            <img 
            className="detail-artist-img-sm"
            alt={userName?userName: "noUser"}
            src={userProfileUrl? userProfileUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF_h6thkbe0oON25G45kdMJU4UDYyC-1hDLK7uFobW9vL0__oa"}
            />

              {token ? 
              <input
                className="comment-input"
                type="text"
                placeholder="댓글을 입력해주세요."
                value={myComment}
                onChange={(e) => {
                  setMyComment(e.target.value)
                }}
              /> 
              : 
              <input
                className="comment-input no-comment"
                type="text"
                placeholder="로그인 시 댓글 작성할 수 있습니다."
                readOnly
              />}

              {token ? <button
                className="primary btn btn-primary mobile-button"
                onClick={() => {
                  addNewComment();
                  setMyComment("");
                }}>
                등록
              </button> 
              :
                <button
                  className="primary btn btn-primary mobile-button">
                  등록
                </button>}

          </div>
          <div className="all-comments">
            {commentsList&&commentsList.map((comment,index)=>{
              return(
                <div className="comment-wrap">
                  <img 
                  className="detail-artist-img-sm"
                  alt={comment.artist}
                  src={comment.profileUrl}
                  onClick={()=>SameName(comment.artist)}
                  />
                  <div className="column-wrap">
                    <EditComment comment={comment} token={token} feedid={detail.id} username={userName}/>
                    

                  </div>
                </div>
              )
            })}
            
          </div>
        </section>  
      )}
      
    </div>
  )
}

export default Detail;