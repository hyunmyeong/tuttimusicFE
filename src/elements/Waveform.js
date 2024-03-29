
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {likeSong} from "../redux/modules/songSlice";

import WaveSurfer from "wavesurfer.js";
import {IoMdPause} from "react-icons/io";
import { IconContext } from "react-icons";
import {FaVolumeUp, FaVolumeOff, FaVolumeDown, FaRegHeart, FaHeart} from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";

import styled from "styled-components";
import {playerPlay, addASong, playerVolume, playerTime, showPlayer, musicEnd} from "../redux/modules/playerSlice";

import {Range, getTrackBackground} from "react-range";

import {IoMdPlay} from "react-icons/io";
import Modal from "./Modal";


function Waveform(props) {

  const dispatch = useDispatch();

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [total, setTotal] = useState(null);
  const [show, setShow] = useState(false);

  const token = localStorage.getItem("token");

  const alert = "로그인 후 하트를 누를 수 있습니다.";

  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    };
const closeModal = () => {
    setModalOpen(false);
    };


  // create new WaveSurfer
  // https://wavesurfer-js.org/docs/methods.html

  const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor:"lightgrey",
    progressColor: props.detail.color,
    cursorColor: props.detail.color,
    barWidth:3,
    barRadius: 2,
    responsive: true,
    height:120,
    //normalize by the maximum peak instead of 1.0
    normalize: true,
    //improve rendering speed of large waveforms
    partialRender: true
  });

  
  useEffect(()=>{
    setPlaying(false);
    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    
    wavesurfer.current.load(props.songUrl);

    wavesurfer.current.on("ready", function(){
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
        setShow(true);
      }
    })
    
    dispatch(showPlayer());
    dispatch(addASong(props.songUrl));
    

    wavesurfer.current.on("finish", function() {
      dispatch(musicEnd(true));
      setPlaying(false);
    })

    return() => 
    wavesurfer.current.destroy();

}, [props.songUrl]);

const playerInfo = useSelector((state)=> state.Player.player);
  const [ _playing, _volume, _time, allStop] = useSelector((state) => [
    state.Player.player?.isPlaying,
    state.Player.player?.volume,
    state.Player.player?.currentTime,
    state.Player.player?.allStop,
  ])

useEffect(()=>{
  setPlaying(_playing);
  if (allStop===false) {
    wavesurfer.current?.playPause();
  }
},[_playing])

useEffect(()=>{
  if (_volume) {
    setVolume(_volume);
    wavesurfer.current?.setVolume(_volume);
  }
},[_volume])


useEffect(()=>{
  setCurrentTime(_time&&_time);
  if (_time>0.2) {
    wavesurfer.current?.play(_time)
  }
},[_time])

useEffect(()=>{
  if (allStop&&allStop===true) {
    setPlaying(false);
  }
},[allStop])

  const handlePlayPause = () => {
    console.log(playing)
    dispatch(playerPlay(playing));
  };

  const onvolumechange = e =>{
    const {target} = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      dispatch(playerVolume(newVolume))
      wavesurfer.current?.setVolume(newVolume);
    }
  }

  const onPlayTimeChange = () =>{
    if(playing===false) {
      handlePlayPause()
    }
    setTimeout(()=> {
    let _currentTime = wavesurfer.current?.getCurrentTime();
    setCurrentTime(_currentTime);
    dispatch(playerTime(_currentTime));
    },300);
  }

  const ClickEmptyHeart =()=>{
    if (!token) {
      openModal();
    }
    dispatch(likeSong({
      token: props.token,
      feedid: props.detail.id,
      likeCount: props.detail.likeCount,
      isLiked: props.detail.flag,
    }))
  }

  const ClickFilledHeart =()=>{
    dispatch(likeSong({
      token: props.token,
      feedid: props.detail.id,
      likeCount: props.detail.likeCount,
      isLiked: props.detail.flag,
    }))
  }
  

  return (
    <>
      {props.loading ? (
      <div className="spinner-wrap">
        <BeatLoader color={"grey"} loading={props.loading} size={10}/>
      </div>
    ):(
    <>
      {show?
      <div className="detail-info-wrap mgtop50">
          <div className="wave-left-wrap">        
          <WaveFlexWrap className="flex-wrap wave-flex-wrap" color={props.detail.color}>
            <button 
              className="play-button btn"
              onClick={handlePlayPause}>
              {!playing ? <IoMdPlay id="play-btn" /> : <IoMdPause/> }
            </button>
          </WaveFlexWrap>
          <div className="flex-wrap">
              {props.detail.flag===false? 
              <IconContext.Provider value={{ color: props.detail.color, className: "heart" }}>
                <div>
                <FaRegHeart
                onClick={
                ClickEmptyHeart
                }/> 
                </div>
              </IconContext.Provider>
              : 
              <IconContext.Provider value={{ color: props.detail.color, className: "heart" }}>
                <div>
                <FaHeart
                onClick={
                  ClickFilledHeart
                }              
                  />
                </div>
              </IconContext.Provider>
              }
              <p className="detail-like">{props.detail.likeCount}</p>
            </div>
            </div>  

          <div className="flex-wrap wave-right-wrap">
            <Controls className="controls" color={props.detail.color}>
              {volume > 0.01 && volume < 0.5 ? <FaVolumeDown id="volume-icon"/> 
              : volume >= 0.5? <FaVolumeUp id="volume-icon"/>
              : <FaVolumeOff id="volume-icon"/>}
              <input
                className="volume-control"
                type="range"
                id="volume"
                name="volume"
                // volume 0 = 1
                min="0.01"
                max="1"
                step="0.025"
                onChange={onvolumechange}
                defaultValue="0.5"
                value={volume? parseFloat(volume):"0.5"}
              />       
            </Controls>
        </div> 
      </div>
      :
      <div className="spinner-wrap">
      <BeatLoader color={"grey"} size={10}/>
      </div>
      }
      

      <div className="detail-wavefom">

        <div 
        id="waveform" 
        ref={waveformRef}
        onClick={onPlayTimeChange}
        />
      </div>
    </>
    )}

<Modal open={modalOpen} close={closeModal} alert={alert}/>
    </>
  )
}

let WaveFlexWrap = styled.div`
.play-button {
  background-color: ${(props) => props.color};
  transition: 0.1s;

&:hover { 
  border-color: ${(props) => props.color};
  color: #fff; 
  animation: pulse 0.8s;
  box-shadow: 0 0 0 16px transparent;
}
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 ${(props) => props.color} }
}

`

let Controls = styled.div`
display: flex;
align-items: center;

#volume-icon {
  color:  ${(props) => props.color};
}

input[type=range] {
  width:140px;
  -webkit-appearance: none;
  margin-left:5px;
}

input[type=range]:focus {
  outline: none;
}
/*webkit (Chrome)의 경우*/
input[type=range]::-webkit-slider-runnable-track {
  width: 140px;
  height: 10px;
  border-radius: 10px;
  cursor: pointer;
  animate: 0.2s;
  background: ${(props) => props.color};
}
input[type=range]::-webkit-slider-thumb {
  border: 1px solid ${(props) => props.color};
  border-radius: 20px;
  height: 20px;
  width: 20px;
  background: #ffffff;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px; 
}


`

export default Waveform;
