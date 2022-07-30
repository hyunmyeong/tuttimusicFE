import React, {useRef, useEffect,useState} from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {SERVER_URL} from "../redux/modules/songSlice";
import Modal from '../elements/Modal';
import NotFound from './NotFound';
import SEO from '../components/SEO';

import { useDispatch } from "react-redux";
import {checkSession} from "../redux/modules/videoSlice";

function CreateLive() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const color_ref = useRef(null);
  const title_ref = useRef(null);
  const description_ref = useRef(null);

  const [previewImg, setPreviewImg] = useState(null);
  const [imgName, setImgName] = useState(null);
  const [imgFile, setImgFlie] = useState(null);

  const [alert, setAlert] = useState("")

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(()=>{
    dispatch(checkSession(false));
  },[]);
  

  const openModal = () => {
        setModalOpen(true);
        };
  const closeModal = () => {
        setModalOpen(false);
        };

  const onLoadImage = (e) => {
    let render = new FileReader()
    setImgName(e.target.files[0].name);
    setImgFlie(e.target.files[0]);

    if(e.target.files[0]) {
      render.readAsDataURL(e.target.files[0])
    }

    render.onload = () => {
      const previewImgUrl = render.result;

      if(previewImgUrl) {
        setPreviewImg(previewImgUrl);
      }
    }

    
  }

  const [color, setColor] = useState("#545454");
  const [colorState, setColorState] = useState(false);
  const [colorRef, setColorRef] = useState("#545454");

  const ColorChange = () => {
    setColor(color_ref.current.value);
  }

  const [musicName, setMusicName] = useState(null);
  const [musicFile, setMusicFile] = useState(null);
  const onLoadMusic = (e) => {
    
    setMusicName(e.target.files[0].name);
    setMusicFile(e.target.files[0]);

  }


  const startLive = () => {

    if (title_ref.current.value === "") {
      setAlert("라이브 제목을 채워 주세요.")
      openModal()
      return;
    } else if (description_ref.current.value === "") {
      setAlert ("소개글을 채워 주세요.")
      openModal()
      return;
    } 
    
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    const addRoomRequestDto = {
      roomTitle : title_ref.current.value,
      description : description_ref.current.value,
    }

    const formData = new FormData();
    formData.append("addRoomRequestDto", new Blob([JSON.stringify(addRoomRequestDto)], {type: "application/json"}))
    formData.append("thumbNailImage", imgFile)
    
    axios.post(`${SERVER_URL}/chatRoom`, formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? token : ""}
    })
    .then((response) => {

      navigate(`/loading/${userName}`); 
      window.scrollTo(0, 0);
    })
    .catch((error) => {
      console.log("err ===> ", error);
    });
  }

  if (!localStorage.getItem("token")) {
    return (
      <NotFound/>
    )
  }

  return (
    <CreateLiveWrap>
      <SEO pageTitle={window.location.pathname.substring(1)}/>
      <div className="upload-wrap">
      <p className="upload-title">라이브 시작하기</p>
      <p className="upload-subtitle">당신의 음악을 라이브로 들려주세요!</p>
      <div className="upload-form">

        {/***** 곡명 *****/}

        <label className="upload-label">
          <span className="upload-label-span">라이브 제목</span>
          <input type="text" className="upload-input" placeholder="라이브 제목을 입력해 주세요." ref={title_ref}/>
        </label>

        {/***** 소개글 *****/}

        <label className="upload-label">
          <span className="upload-label-span">소개글</span>
          <textarea className="upload-input" placeholder="라이브에 대해 소개해 주세요." ref={description_ref}/>
        </label>


        {/***** 앨범 커버 *****/}

        <div className="upload-image-wrap">

        <label className="upload-label">
          <span className="upload-label-span">썸네일</span>
          </label>
          <div className="upload-image-box">
          <UploadImagePreview previewImg={previewImg}></UploadImagePreview>
          <label className="secondary upload-label-button" for="upload-image">이미지 업로드</label>
          <input type="file" id="upload-image" accept='image/*' onChange={onLoadImage} />
          </div>
          </div>

          <button 
          className="primary upload-button"
          onClick={()=>{
            startLive()
          }}>라이브 시작</button>

      </div>
      </div>

      <Modal open={modalOpen} close={closeModal} alert={alert}/>

    </CreateLiveWrap>
  )
}



let CreateLiveWrap = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-bottom: 80px;

`

let UploadImagePreview = styled.div`
  width:480px;
  height:270px;
  background-color:#E8E8E8;
  border-radius: 10px;
  background-image:url(${(props) => props.previewImg});
  background-size:cover;
  background-position: 50% 50%;

  @media only screen and (min-width: 481px)and (max-width: 1920px) {
  width: 460px;
  height: 250px;
  }

  
  @media only screen and (max-width: 480px) {
  width: 60%;
  height: 100%;
  aspect-ratio: 16 / 9;
  }
`

export default CreateLive;