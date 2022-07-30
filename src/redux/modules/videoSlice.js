import { createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = "";

const VideoSlice = createSlice({
  name: "Video",
  initialState: {
    videoSession: false,
  },

  reducers: {
    checkSession: (state, action)=>{
      console.log(action.payload)
      const new_list = {...current(state), videoSession: action.payload};
      state.video = new_list;
    },

  },
  extraReducers: {
    // middlewares

  }



})

export const {checkSession} = VideoSlice.actions;
export default VideoSlice.reducer;