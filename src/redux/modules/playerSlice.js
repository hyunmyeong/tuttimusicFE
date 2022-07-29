import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = "";

const PlayerSlice = createSlice({
  name: "player",
  initialState: {
    display: false,
    currentSong: null,
    isPlaying: false,
    volume: 0.5,
    currentTime: 0,
    allStop: false,
  },

  reducers: {
    
    showPlayer: (state,action) => {
      const new_list = {...current(state), display: true};
      state.player = new_list;
    },
    
    addASong: (state,action) => {
      const new_list2 = {...current(state.player), currentSong:action.payload};
      state.player = new_list2;
    },

    playerPlay: (state,action) => {
      console.log(current(state.player))
      console.log(action.payload)
      const new_list = {...current(state.player), isPlaying:!action.payload, allStop: false};
      state.player = new_list;
    },

    playerVolume: (state,action) => {
      const new_list = {...current(state.player), volume:action.payload};
      state.player = new_list;
    },

    playerTime: (state,action) => {
      const new_list = {...current(state.player), currentTime:action.payload, allStop: false};
      state.player = new_list;
    },

    hidePlayer: (state,action) => {
      const new_list = {...current(state), display: false};
      state.player = new_list;
    },

    musicEnd: (state,action)=>{
      const new_list = {...current(state.player), allStop: true, currentTime: 0.1, isPlaying:false };
      state.player = new_list;
    }


  },
  extraReducers: {
    // middlewares

  }



})

export const {playerPlay, addASong, playerVolume, playerTime, showPlayer, hidePlayer, musicEnd} = PlayerSlice.actions;
export default PlayerSlice.reducer;