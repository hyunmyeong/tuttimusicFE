import React, { useEffect, useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {getSongDetail,postComment, SERVER_URL, likeSong} from "../redux/modules/songSlice"
import {FaRegHeart, FaHeart} from "react-icons/fa";
import { IconContext } from "react-icons";
import {MdDelete} from "react-icons/md"
import BeatLoader from "react-spinners/BeatLoader";
import {BsCheckCircle} from "react-icons/bs";
import {MdEdit} from "react-icons/md";
import moment from "moment";
import axios from "axios";
import EditComment from "../elements/EditComment";
import EditDelete from "../elements/EditDelete";
import SEO from '../components/SEO';

function DetailVideo() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let params = useParams();

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
  },200)
  window.scrollTo(0,0);
},[])

  //get lists from songslice
  const detail = useSelector((state)=> state.Song.detail);
  const commentsList = useSelector((state)=> state.Song.comments);
  console.log(detail.genre)

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




  //go to Edit
  const GoEdit = () => {
    navigate(`/edit/${params.id}`, {state: detail});
  }

  //delete this post
  const GoDelete = () => { 

  if(window.confirm("삭제하시겠습니까?")) {
    axios.delete(`${SERVER_URL}/feeds/${params.id}`,{
      headers: {
        Authorization: token ? token : ""}
    })
    .then((response) => {
    })
    .catch((error) => {
    });
    alert("삭제되었습니다.");
    navigate("/musicfeed");
  } 
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

  const SameName = (artist) => {
    if(artist === localStorage.getItem("userName")) {
      navigate("/mypage");
    } else {
      navigate(`/userpage/${artist}`);
    }
  }
  
  return (
    <div className="detail-container">
      <SEO pageTitle={"Video"}/>
{/* MUSIC DETAIL AREA */}      
      {loading? (
        <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
      ):(
      <>
        <section className="music-video">
        <video controls controlsList="nodownload">
        <source src={detail.songUrl} type="video/mp4"/>
        브라우저가 video 태그를 지원하지 않습니다.
      </video>
      <div class="music-video-title-wrap">
      <div className="music-video-title">
        <span>{detail.title}</span>
        <span className="music-video-genre video-genre">{detail.genre}</span>
      </div>
      <div className="music-video-edit-box">
      {userName === detail.artist ?  
          <EditDelete detail={detail} token={token} id={params.id}/>
          : null}
      
      </div>
          </div>
      </section>
      <div className="flex-wrap">
              {detail.flag===false? 
              <FaRegHeart
              onClick={
                ClickEmptyHeart
              }/> 
              : 
              <>
              <IconContext.Provider value={{ color:detail.color}}>
              <FaHeart
              onClick={
                ClickFilledHeart
              }
              />
              </IconContext.Provider>
              </>}

              <p className="detail-like">{detail.likeCount}</p>
            </div>
        <section className="music-detail">
        
        
        
        
          <div className="left-column">
            <div className="detail-artist-profile"
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
        <div className="divider"></div>
{/* COMMENT AREA */}
      {loading? (
        <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
      ):(
        <section className="music-comment">
          <p className="detail-comment-title">
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
                className="comment-input"
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
                  onClick={()=>SameName(detail.artist)}
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

export default DetailVideo;