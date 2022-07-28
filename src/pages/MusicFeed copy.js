import React, { useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {getMusicFeed} from "../redux/modules/songSlice";

import BeatLoader from "react-spinners/BeatLoader";


function MusicFeed() {
  const [loading, setLoading] = useState(true);
  const [_type, setType] = useState("audio");
  const [_genre, setGenre] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(()=>{
    setLoading(true);
    setType("audio");
    const data= {
      token:token,
      type: _type,
      genre: null,
    }
    dispatch(getMusicFeed(data));
    setTimeout(()=> {
      setLoading(false);
    },100)
    window.scrollTo(0,0);
  },[])

  const allList = useSelector((state) => state.Song.allList);

  const ClickGenre =(genre)=>{
    setGenre(genre);
      const data3= {
        token: token,
        type: _type,
        genre: _genre,
      }
      dispatch(getMusicFeed(data3))
    }

  const genreList = [
    {genre: "발라드"},
    {genre: "어쿠스틱"},
    {genre: "알앤비"},
    {genre: "힙합"},
    {genre: "댄스"},
    {genre: "연주곡"},
  ]

  return (
    <div className="musicfeed-container">
      <section className="feed-category">
        <p className="genre-text">
          장르
        </p>
        <div className="categories">
          {genreList.map((genre,index)=>{
            return (
            <div 
            className="category"
            onClick={()=>{
              ClickGenre(genre.genre)
            }}>
            {genre.genre}
          </div>
            )
          })}
        </div>
      </section>

      <section className="feed-list">

        {loading? (
          <div className="spinner-wrap">
          <BeatLoader color={"grey"} loading={loading} size={10}/>
        </div>
        ):(
          <>{allList&&allList.map((song,index)=>{
              return(
                <div 
                className="feed-card"
                onClick={()=>{
                  navigate('/detail/'+song.id)
                }}>
                  <img
                  alt={song.title}
                  className="main-album-art" 
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
          </>
        )}
       
      </section>
    
    </div>
  )
}

export default MusicFeed;