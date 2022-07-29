import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import {SERVER_URL} from "../redux/modules/songSlice";
import SEO from '../components/SEO';

function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const keyword= location.state
  const [data, setData] =useState(null);
  const [type, setType] =useState(null);
  const [subtype, setSubtype] =useState(null);
  
  const token = localStorage.getItem("token");

  useEffect(()=>{
    setData(null);
  },[keyword])

    const musicArtist = useSelector((state)=> state.Song.result_musicArtist)
    const musicTitle = useSelector((state)=> state.Song.result_musicTitle)
    const videoArtist = useSelector((state)=> state.Song.result_videoArtist)
    const videoTitle = useSelector((state)=> state.Song.result_videoTitle)
    const searchArtist = useSelector((state)=> state.Song.result_artist)
    console.log(searchArtist);

    const list1= musicTitle?.filter((item, index) => {
        return index <6;
      })
    const list2= musicArtist?.filter((item, index) => {
        return index <6;
      })
    const list3= videoTitle?.filter((item, index) => {
        return index <4;
      })
    const list4= videoArtist?.filter((item, index) => {
        return index <4;
      })

    const moreResultsClick =(props)=> {
      if (props === "moreArtist") {
        axios
        .get(`${SERVER_URL}/search/moreArtist?keyword=${keyword}`, {
          headers: {Authorization:token? token:""}
        })
        .then((response)=>{
          setData(response.data.results)
        })
        .catch((error)=>{
        })
      } else {
        axios
        .get(`${SERVER_URL}/search/more?category=${props}&keyword=${keyword}`, {
          headers: {Authorization:token? token:""}
        })
        .then((response)=>{
          setData(response.data.results)
        })
        .catch((error)=>{
        })
      }

    }

  return (
    
    <div className="musicfeed-container">
      <SEO pageTitle={"search"}/>
      {data?
      <>
      {type === "아티스트" ? 
      <>
      <p className="search-head"><span className="bold">
        '{keyword}'</span>에 대한 {type} 검색 결과입니다.
        </p>
      </> 
      : 
      <>
      <p className="search-head"><span className="bold">
        '{keyword}'</span>에 대한 {type} : {subtype}으로 검색한 결과입니다.
        </p>
      </>
      }
        <p 
        className="more-results right-text"
        onClick={()=>{
          setData(null);
        }}
        >
          전체 검색 결과로 돌아가기
        </p>
      

        {type === "곡"?
          <section className="feed-list">
            {data.map((song,index)=>{
            return(
            <div 
            className="feed-card tab-card search-card"
            onClick={()=>{
              navigate('/detail/'+song.id)
            }}>
              <img
              alt={song.title}
              className="main-album-art" 
              src={song.albumImageUrl}
              />
              <div className="main-card-text page-card-text">
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
        </section>
        : type === "영상"?
        <section className="feed-list tab-body">
            {data.map((song,index)=>{
            return(
            <div 
            className="mypage-video-card"
            onClick={()=>{
              navigate('/detail/'+song.id)
            }}>
              <img
              alt={song.title}
              className="mypage-main-thumbnail" 
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
          </section>
        : type === "아티스트" ? 
        <section className="body-like-list result-more-artist-list">
          
        {data.map((artist,index)=>{
        return(
        <div 
        className="body-following-card"
        onClick={()=>{
          navigate('/userpage/'+artist.artist)
        }}>
          <img
          alt={artist.artist}
          className="body-circle" 
          src={artist.profileUrl}
          />
            <p className="body-title">
            {artist.artist}
            </p>
        </div>
        )
        })
        }
      </section> :
      null}
      </>
      :
      <>
      <p className="search-head"><span className="bold">
        '{keyword}'</span>에 대한 검색 결과입니다.
      </p>

      {/* 아티스트 */}

      <div className="search-flex search-flex-artist">
      <p className="result-name result-name-artist">
        아티스트
      </p>
        {searchArtist&&searchArtist.length > 6 ?
        <p 
        className="more-results"
        onClick={()=>{
          moreResultsClick("moreArtist")
          setType("아티스트")
          setSubtype("곡명")
        }}
        >
          더보기
        </p>
        : null}
      </div> 
      {searchArtist&&searchArtist.length > 0 ?
      <>
        <section className="body-like-list result-artist-list">
          
          {searchArtist.map((artist,index)=>{
          return(
          <div 
          className="body-following-card"
          onClick={()=>{
            navigate('/userpage/'+artist.artist)
          }}>
            <img
            alt={artist.artist}
            className="body-circle" 
            src={artist.profileUrl}
            />
              <p className="body-title">
              {artist.artist}
              </p>
          </div>
          )
          })
          }
        </section> 
        
      </>
      :
      <>
        <section className="feed-list">
        <p className="result-none">
          매칭하는 아티스트가 없어요.
        </p>
        </section>
      </>
      }



      {/* 오디오 */}

      <p className="result-name">
        곡
      </p>
      <div className="search-flex">

        {/* 오디오 - 곡명으로 검색 */}

        <p className="result-sub-name">
          곡명으로 검색
        </p>
        {musicTitle&&musicTitle.length > 6 ?
        <p 
        className="more-results"
        onClick={()=>{
          moreResultsClick("musicTitle")
          setType("곡")
          setSubtype("곡명")
        }}
        >
          더보기
        </p>
        : null}
      </div> 
      {musicTitle&&musicTitle.length > 0 ?
      <>
        <section className="feed-list tab-body">
          
          {list1.map((song,index)=>{
          return(
          <div 
          className="feed-card tab-card search-card"
          onClick={()=>{
            navigate('/detail/'+song.id)
          }}>
            <img
            alt={song.title}
            className="main-album-art" 
            src={song.albumImageUrl}
            />
            <div className="main-card-text page-card-text">
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
        </section> 
        
      </>
      :
      <>
        <section className="feed-list">
        <p className="result-none">
          매칭하는 곡명이 없어요.
        </p>
        </section>
      </>
      }

      {/* 오디오 - 아티스트명으로 검색 */}

      <div className="search-flex">
        <p className="result-sub-name">
          아티스트명으로 검색
        </p>
        {musicArtist&&musicArtist.length > 6 ?
        <p 
        className="more-results"
        onClick={()=>{
          moreResultsClick("musicArtist")
          setType("곡")
          setSubtype("아티스트명")
        }}
        >
          더보기
        </p>
        : null}
      </div> 
      {musicArtist&&musicArtist.length > 0 ?
        <>
          <section className="feed-list tab-body">
            {list2.map((song,index)=>{
            return(
            <div 
            className="feed-card tab-card search-card"
            onClick={()=>{
              navigate('/detail/'+song.id)
            }}>
              <img
              alt={song.title}
              className="main-album-art" 
              src={song.albumImageUrl}
              />
              <div className="main-card-text page-card-text">
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
          </section> 
        </>
        :
        <>
          <section className="feed-list">
          <p className="result-none">
            매칭하는 아티스트가 없어요.
          </p>
          </section>
        </>
        }

      {/* 비디오 */}
      <p className="result-name">
        영상
      </p>
      <div className="search-flex">
      {/* 비디오 - 곡명으로 검색 */}
        <p className="result-sub-name">
          곡명으로 검색
        </p>
        {videoTitle&&videoTitle.length > 6 ?
        <p 
        className="more-results"
        onClick={()=>{
          moreResultsClick("videoTitle")
          setType("영상")
          setSubtype("곡명")
        }}
        >
          더보기
        </p>
        : null}
      </div> 
      {videoTitle&&videoTitle.length > 0 ?
      <>
        <section className="feed-list tab-body">
          {list3.map((song,index)=>{
          return(
          <div 
          className="mypage-video-card"
          onClick={()=>{
            navigate('/detail/video/'+song.id)
          }}>
            <img
            alt={song.title}
            className="mypage-main-thumbnail" 
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
        </section> 
        
      </>
      :
      <>
        <section className="feed-list">
        <p className="result-none">
          매칭하는 곡명이 없어요.
        </p>
        </section>
      </>
      }

      {/* 비디오 - 곡명으로 검색 */}
    <div className="search-flex">
        <p className="result-sub-name">
          아티스트명으로 검색
        </p>
        {videoArtist&&videoArtist.length > 6 ?
        <p 
        className="more-results"
        onClick={()=>{
          moreResultsClick("videoArtist")
          setType("영상")
          setSubtype("아티스트명")
        }}
        >
          더보기
        </p>
        : null}
      </div> 
      {videoArtist&&videoArtist.length > 0 ?
        <>
          <section className="feed-list tab-body">
            {list4.map((song,index)=>{
            return(
            <div 
            className="mypage-video-card"
            onClick={()=>{
              navigate('/detail/video/'+song.id)
            }}>
              <img
              alt={song.title}
              className="mypage-main-thumbnail" 
              src={song.albumImageUrl}
              />
              <div className="main-card-text page-card-text">
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
          </section> 
        </>
        :
        <>
          <section className="feed-list">
          <p className="result-none">
            매칭하는 아티스트가 없어요.
          </p>
          </section>
        </>
        }
      </>
      }
    </div>
  )
}

export default SearchResult;