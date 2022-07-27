import React, { useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { HexColorPicker } from "react-colorful";
import { FaMusic } from "react-icons/fa"
import axios from 'axios';
import {SERVER_URL} from "../redux/modules/songSlice";
import Modal from '../elements/Modal';
import imageCompression from 'browser-image-compression'; 
import NotFound from './NotFound';


function UploadVideo() {

  const navigate = useNavigate();
  const color_ref = useRef(null);
  const title_ref = useRef(null);
  const description_ref = useRef(null);

  //모달
  const [alert, setAlert] = useState("")
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
        setModalOpen(true);
        };
  const closeModal = () => {
        setModalOpen(false);
        };

  const [selectGenre, setSelectGenre] = React.useState("장르를 선택해 주세요.");
  const [genreState, setGenreState] = React.useState(false);
  
  const genreList = ["발라드", "어쿠스틱","R&B", "힙합", "댄스", "연주곡"]

  const genreOpenClose = () => {
    setGenreState(!genreState);
  }

  const GenreSelect = () => {
    return (
      <>
        <div className="upload-options-container">
          {genreList.map((item) => (
            <div className="upload-option">
              <input
                type="radio"
                className="radio"
                id={item}
                name={item}
                key={item}
              ></input>
              <label
                for={item}
                className="upload-select-option"
                onClick={(item) => {
                  setSelectGenre(item.target.innerText);
                  setGenreState(!genreState);
                }}
              >
                {item}
              </label>
            </div>
          ))}
        </div>
      </>
    );
  };

  const [previewImg, setPreviewImg] = React.useState(null);
  const [imgName, setImgName] = React.useState(null);
  const [imgFile, setImgFile] = React.useState(null);


  const onLoadImage = (e) => {
    let render = new FileReader()
    setImgName(e.target.files[0].name);
    imgSizeOpt(e.target.files[0])

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

  const imgSizeOpt = async (img) => {
    console.log(img)
    const options = { 
      maxSizeMB: 1, 
      maxWidthOrHeight: 400
    }
    
    try {
      const compressedFile = await imageCompression(img, options);
      setImgFile(compressedFile);
      console.log(imgFile)
    } catch (error) {
      console.log(error);
    }
  }


  const [color, setColor] = React.useState("#545454");
  const [colorState, setColorState] = React.useState(false);
  const [colorRef, setColorRef] = React.useState("#545454");

  const ColorChange = () => {
    console.log("colorRef ===>", color_ref.current.value);
    console.log("color ===>", color);
    setColor(color_ref.current.value);
  }

  const [musicName, setMusicName] = React.useState(null);
  const [musicFile, setMusicFile] = React.useState(null);

  const onLoadMusic = (e) => {
    setMusicName(e.target.files[0].name);
    setMusicFile(e.target.files[0]);
  }

  const [submit, setSubmit] = React.useState(false);

  const uploadMusic = () => {

    if (submit === true) {
      return;
    }

    setSubmit(true);

    if (title_ref.current.value === "") {
      setAlert("곡명을 채워 주세요.")
      openModal()
    } else if (description_ref.current.value === "") {
      setAlert ("소개글을 채워 주세요.")
      openModal()
    } else if (selectGenre === "장르를 선택해 주세요.") {
      setAlert ("장르를 선택해 주세요.")
      openModal()
    } else if (musicName === null) {
      setAlert ("파일을 첨부해 주세요.")
      openModal()
    }

    else {
    
    const token = localStorage.getItem("token");
    console.log(imgFile)
    const file = new File([imgFile], musicName.slice(0,-4)+".png");
    console.log(file)

    const feedRequestDto = {
      title : title_ref.current.value,
      musicTitle : musicName,
      description : description_ref.current.value,
      postType : "video",
      genre : selectGenre,
      color : color
    }

    console.log("feedRequestDto ==> ",feedRequestDto);

    const formData = new FormData();
    formData.append("feedRequestDto", new Blob([JSON.stringify(feedRequestDto)], {type: "application/json"}))
    formData.append("song", musicFile)
    formData.append("albumImage", file)



    axios.post(`${SERVER_URL}/feeds/upload`, formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? token : ""}
    })
    .then((response) => {
      setSubmit(false);
      console.log("res ===> ", response);
      setAlert("피드가 등록되었습니다.");
      openModal()
      navigate("/musicfeed")
      window.scrollTo(0, 0);
    })
    .catch((error) => {
      console.log("err ===> ", error);
      setAlert("피드 등록에 실패했습니다.")
      openModal()
    });
  }
}

if (!localStorage.getItem("token")) {
  return (
    <NotFound/>
  )
}

  return (

    
    <UpLoad>
      <div className="upload-wrap">
      <p className="upload-title">영상 업로드</p>
      <p className="upload-subtitle">당신의 음악을 세상에 들려주세요!</p>
      <div className="upload-form">

        {/***** 곡명 *****/}

        <label className="upload-label">
          <span className="upload-label-span">곡명</span>
          <input type="text" className="upload-input" placeholder="곡명을 입력해 주세요." ref={title_ref}/>
        </label>

        {/***** 소개글 *****/}

        <label className="upload-label">
          <span className="upload-label-span">소개글</span>
          <textarea className="upload-input" placeholder="곡에 대해 소개해 주세요." ref={description_ref}/>
        </label>

        {/***** 장르 *****/}

        <label className="upload-label">
          <span className="upload-label-span">장르</span>

          <div className="upload-select-box">
              <div className="upload-selected" onClick={genreOpenClose}>
                {/* <div className="selected" > */}
                {selectGenre}
                  
              </div>

              {genreState ? <GenreSelect /> : null}
            </div>

        </label>

        {/***** 앨범 커버 *****/}

        <div className="upload-image-wrap">

        <label className="upload-label">
          <span className="upload-label-span">썸네일</span>
          </label>
          <div className="upload-image-box">
          <UploadImagePreview previewImg={previewImg} className="upload-image-preview"></UploadImagePreview >
          <label className="secondary upload-label-button" for="upload-image">이미지 업로드</label>
          <input type="file" id="upload-image" accept='image/*' onChange={onLoadImage} />
          </div>
          </div>
          
        

        {/***** 컬러 *****/}

        <div className="upload-color-wrap">

        <label className="upload-label">
          <span className="upload-label-span">컬러</span>
          <div className="upload-mobile-color">
          <input type="text" className="upload-input" id="upload-input-color" onChange={ColorChange} ref={color_ref} placeholder="HEX 코드(#000000)를 입력하시거나 오른쪽 버튼을 눌러 색상을 골라주세요."/>
          <UploadColor color={color} onClick={() => setColorState(!colorState)}></UploadColor>
          </div>
        </label>

        {colorState ? 
        <HexColorPicker 
        className="hex-color"
        color={color} 
        onChange={setColor}/>
        : null }

        </div>
        
        

        {/***** 파일 *****/}
        <div className="upload-music-wrap">

        <label className="upload-label">
          <span className="upload-label-span">파일</span>
          </label>
          <div className="upload-music-box">
          <label className="secondary upload-label-button-music" for="upload-music">
          <FaMusic id="upload-music-icon"/></label>
          <input type="text" className="upload-input" id="upload-input-music" placeholder="음악 파일을 선택해 주세요." value={musicName}/>
          <input type="file" id="upload-music" accept='video/*' onChange={onLoadMusic}/>
          </div>
          </div>

          <button className="primary upload-button" onClick={uploadMusic}>업로드</button>
        
      </div>
      </div>
      <Modal open={modalOpen} close={closeModal} alert={alert}/>
      </UpLoad>
  )
}


let UpLoad = styled.div`
display: flex;
justify-content: center;
align-items: center;

  .hex-color {
    width: 200px;
    height: 200px;
    position:absolute;
    display: flex;
    z-index:22;
    bottom: 10px;
    right: -220px;
  }

`

let UploadImagePreview = styled.div`
  width:480px;
  height:270px;
  background-color:#E8E8E8;
  border-radius: 10px;
  background-image:url(${(props) => props.previewImg});
  background-size:cover;
  background-position: 50% 50%;

  @media only screen and (max-width: 480px) {
  width: 60%;
  height: 100%;
  aspect-ratio: 16 / 9;
  }

`

let UploadColor = styled.div`
  width: 60px;
  height: 60px;
  background-color:${(props) => props.color};
  margin-left: 20px;
  border-radius: 10px;

  @media only screen and (max-width: 480px) {
  width: 50px;
  height: 50px;
  margin-left:0;
  aspect-ratio: 1 / 1;
  }

`


export default UploadVideo;