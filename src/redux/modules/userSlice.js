import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = "https://seyeolpersonnal.shop";


const UserSlice = createSlice({
  name: "User",
  initialState: {
    followerCount: 0,
    list: [{}],

  },

  reducers: {
    
    getCount: (state, action)=>{
      const new_list = {...current(state), followerCount: action.payload};
      state.artist = new_list;
    },

    addCount: (state, action)=>{
      const new_list = {...current(state), followerCount: action.payload+1};
      state.artist = new_list;
    },

    subtractCount: (state, action)=>{
      const new_list = {...current(state), followerCount: action.payload-1};
      state.artist = new_list;
    }


  },
  extraReducers: {
    // middlewares

  }



})

export const {getCount, addCount, subtractCount} = UserSlice.actions;
export default UserSlice.reducer;