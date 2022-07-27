import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { FaMicrophone } from "react-icons/fa";
import { BsFillFileEarmarkPlayFill } from "react-icons/bs";
import NotFound from './NotFound';
import SEO from '../components/SEO';

function UploadChoice() {

  const navigate = useNavigate();

  if (!localStorage.getItem("token")) {
    return (
      <NotFound/>
    )
  }

  return (
    <div className="choice-wrap">
      <SEO pageTitle={"upload"}/>
      <div className="choice-title">업로드</div>
      <div className="choice-title-sub">업로드 유형을 선택해 주세요.</div> 
      <div className="choice-button-wrap">
      <button className="choice-button" onClick={() => { navigate("/upload/audio") }}><FaMicrophone id="choice-icon"/>오디오 업로드</button>
      <button className="choice-button" onClick={() => { navigate("/upload/video") }}><BsFillFileEarmarkPlayFill id="choice-icon"/>비디오 업로드</button>
      </div>
    </div>
  )
}

export default UploadChoice;