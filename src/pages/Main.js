import React, { useEffect, useState} from "react";
import { useSelector, useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

import {getMainLists} from "../redux/modules/songSlice"

import Slider from "react-slick";
import "../styles/slick.css";
import "../styles/slick-theme.css";

import BeatLoader from "react-spinners/BeatLoader";
import Footer from "../components/Footer";

import ImageUrl from "../elements/ImageSrc";
import { useMediaQuery } from "react-responsive";

import SEO from '../components/SEO';


function Main() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isMobile = useMediaQuery({
    query : "(max-width:480px)"
  })


  useEffect(()=>{
    const token= localStorage.getItem("token");
    dispatch(getMainLists(token))
    .then((response) => {
      if (response.type === "GET/getMainLists/rejected") {
        localStorage.clear();
        navigate("/");
        window.location.reload();
      }
    })

    setTimeout(()=> {
      setLoading(false);
    },200)
    window.scrollTo(0,0);

  },[])

  const [genreList, latestList,likeList, videoList] = useSelector((state) => [
    state.Song.genreList,
    state.Song.latestList,
    state.Song.likeList,
    state.Song.videoList
  ])

  
  // slider
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "transparent" }}
        onClick={onClick}
      />
    );
  }
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "transparent" }}
        onClick={onClick}
      />
    );
  }

  // slider settings
  let settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 950,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        }
      },
      {
        breakpoint: 700,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        }
      },
      {
        breakpoint: 620,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: false,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        }
      }
    ]
  };

  // slider settings ->video
  let settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          nextArrow: <SampleNextArrow />,
          prevArrow: <SamplePrevArrow />,
        }
      }
    ]
  };

  //slider setting banner

  let settings3 = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3500,
    arrows: false,
  };


  return (
    <>
      <div className="main-container">
        <SEO pageTitle={"main"}/>
      <section className="main-top">
        
        <div className="main-top-header">
          <Slider {...settings3}>
          <div className="banner-wrap banner-tutti">
          <img 
          src=
          {isMobile ? `${ImageUrl.banner_tutti_mobile}` : `${ImageUrl.banner_tutti_web}`}
          className="main-banner"
          onClick={() => window.open('https://fluoridated-shell-c1f.notion.site/About-tutti-78df41db1a2c4e08949891dcdb8098a7','_blank')}
          />
          </div>
          <div className="banner-wrap banner-event">
          <img 
          src=
          {isMobile ? `${ImageUrl.banner_event_mobile}` : `${ImageUrl.banner_event_web}`}
          className="main-banner"
          onClick={() => window.open('https://fluoridated-shell-c1f.notion.site/72aead2f89784bebb436f1f253251fb2','_blank')}
          />
          </div>
          </Slider>
          
        </div>
      </section>
      <section className="main-content">
        <div className="main-list">
          <p className="main-list-title">
            최근 출시한 음악
          </p>
          {loading? (
            <div className="spinner-wrap">
              <BeatLoader color={"grey"} loading={loading} size={10}/>
            </div>
          ):(
            <Slider {...settings}>     
            {latestList&&latestList.map((song,index) =>{
              return(
                <div 
                className="main-card"
                onClick={()=>{
                  navigate('/detail/'+song.id)
                }}>
                  <img
                  alt={song.title}
                  className="main-album-art mobile-album-art" 
                  src={song.albumImageUrl}
                  srcset={song.albumImageUrl+" 100w"}
                  sizes="30vw"
                  />
                  <div className="main-card-text">
                    <p className="main-card-title">
                    {song.title}
                    </p>
                    <p className="main-card-artist">
                    {song.artist}
                    </p>
                  </div>
                </div>
                  )
                })}               
              </Slider>
              )}
          
        </div>
        <div className="main-list">
          <p className="main-list-title">
            좋아요 많이 받은 음악
          </p>
          {loading? (
            <div className="spinner-wrap">
              <BeatLoader color={"grey"} loading={loading} size={10}/>
            </div>
          ):(
            <Slider {...settings}>     
            {likeList&&likeList.map((song,index) =>{
              return(
                <div 
                className="main-card"
                onClick={()=>{
                  navigate('/detail/'+song.id)
                }}>
                  <img
                  alt={song.title}
                  className="main-album-art mobile-album-art" 
                  src={song.albumImageUrl}
                  />
                  <div className="main-card-text">
                    <p className="main-card-title">
                    {song.title}
                    </p>
                    <p className="main-card-artist">
                    {song.artist}
                    </p>
                  </div>
                </div>
                  )
                })}               
              </Slider>
              )}          
        </div>
        <div className="main-list">

          <div className="main-list-header">
          <p className="main-list-title">
            장르 음악
          </p>
          <p className="main-list-subtitle">
            {genreList&&genreList ? genreList[0].genre : null}
          </p>
          </div>
          {loading? (
            <div className="spinner-wrap">
              <BeatLoader color={"grey"} loading={loading} size={10}/>
            </div>
          ): genreList&&genreList.length < 6?
          (
            <div className="row-wrap-left">
            {genreList&&genreList.map((song,index) =>{
              return(
                <div 
                className="main-card genre-card"
                onClick={()=>{
                  navigate('/detail/'+song.id)
                }}>
                  <div className="musicfeed-album-box">
                  <img
                  alt={song.title}
                  className="main-album-art musicfeed-album-art mobile-album-art" 
                  src={song.albumImageUrl}
                  />
                  </div>
                  <div className="main-card-text musicfeed-card-text">
                    <p className="main-card-title">
                    {song.title}
                    </p>
                    <p className="main-card-artist">
                    {song.artist}
                    </p>
                  </div>
                </div>
                  )
                })}
            </div>
          ):(

            <Slider {...settings}>     
            {genreList&&genreList.map((song,index) =>{
              return(
                <div 
                className="main-card"
                onClick={()=>{
                  navigate('/detail/'+song.id)
                }}>
                  <img
                  alt={song.title}
                  className="main-album-art mobile-album-art" 
                  src={song.albumImageUrl}
                  />
                  <div className="main-card-text">
                    <p className="main-card-title">
                    {song.title}
                    </p>
                    <p className="main-card-artist">
                    {song.artist}
                    </p>
                  </div>
                </div>
                  )
                })}               
              </Slider>
              )}
        </div>
        <div className="main-list">
          <p className="main-list-title">
            영상
          </p>
          {loading? (
            <div className="spinner-wrap">
              <BeatLoader color={"grey"} loading={loading} size={10}/>
            </div>
          ): videoList&&videoList.length < 4?
          (
          <div className="row-wrap-left">
            {videoList.map((song,index) =>{
              return(
                
                  <div 
                  className="video-card"
                  onClick={()=>{
                    navigate('/detail/video/'+song.id)
                  }}>
                    <img
                    alt={song.title}
                    className="main-thumbnail" 
                    src={song.albumImageUrl}
                    />
                    <div className="main-card-text">
                      <p className="main-card-title">
                      {song.title}
                      </p>
                      <p className="main-card-artist">
                      {song.artist}
                      </p>
                    </div>
                  </div>
                
                  )
                })
            }   
          </div>           
          ):
          (
            <Slider {...settings2}>     
            {loading ===false&&videoList&&videoList.map((song,index) =>{
              return(
                <div 
                className="video-card"
                onClick={()=>{
                  navigate('/detail/video/'+song.id)
                }}>
                  <img
                  alt={song.title}
                  className="main-thumbnail" 
                  src={song.albumImageUrl}
                  />
                  <div className="main-card-text">
                    <p className="main-card-title">
                    {song.title}
                    </p>
                    <p className="main-card-artist">
                    {song.artist}
                    </p>
                  </div>
                </div>
                  )
                })}               
              </Slider>
              )}
        </div>
        
      </section>
    </div>
    <Footer/>
    </>
  )
}

export default Main;