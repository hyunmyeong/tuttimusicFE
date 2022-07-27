import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = "https://seyeolpersonnal.shop";

// //GET ARTIST INFO
// export const getArtistPage = createAsyncThunk("GET/getArtistPage", async (props)=>{
//   console.log(props)
//   return axios
//   .get("https://seyeolpersonnal.shop/user/profile/"+params.artist, {
//       headers: {Authorization:token? token:""}
//     })
//   .then((response)=> response.data.data);
// })

// //FOLLOW
// export const followAnArtist = createAsyncThunk("POST/followAnArtist", async (props)=>{
//   await axios
//   .post(`${SERVER_URL}/follow?artist=${props.artist}`,{}, {
//     headers: {Authorization:props.token? props.token:""}
//   })
//   .then((response) => 
//   console.log(response.data));
  
//   return props;
// })


const UserSlice = createSlice({
  name: "User",
  initialState: {
    followerCount: 0,
    list: [{}],

  },

  reducers: {
    
    getCount: (state, action)=>{
      console.log(action.payload)
      const new_list = {...current(state), followerCount: action.payload};
      state.artist = new_list;
      console.log(state.artist);
    },

    addCount: (state, action)=>{
      console.log(action.payload)
      const new_list = {...current(state), followerCount: action.payload+1};
      state.artist = new_list;
      console.log(state.artist);
    },

    subtractCount: (state, action)=>{
      console.log(action.payload)
      const new_list = {...current(state), followerCount: action.payload-1};
      state.artist = new_list;
      console.log(state.artist);
    }


  },
  extraReducers: {
    // middlewares

  }



})

export const {getCount, addCount, subtractCount} = UserSlice.actions;
export default UserSlice.reducer;