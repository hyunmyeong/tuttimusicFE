import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from "axios";

export const SERVER_URL = "https://seyeolpersonnal.shop";

//GET MAIN POST (HOME TAB)
export const getMainLists = createAsyncThunk("GET/getMainLists", async (token)=>{
  return axios
  .get(`${SERVER_URL}/`,{
    headers: {Authorization:token? token:""}
  })
  .then((response)=> response.data.data)
})

//GET MUSICFEED (FEED TAB)
export const getMusicFeed = createAsyncThunk("GET/getMusicFeed", async (props)=>{

  return axios
  .get(`${SERVER_URL}/feeds?postType=${props.type}&genre=${props.genre}&page=${props.page}&limit=${props.limit}`,{
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response)=> response.data.data.content);
})

//GET SONG DETAIL
export const getSongDetail = createAsyncThunk("GET/getSongDetail", async (props)=>{
  return axios
  .get(`${SERVER_URL}/feeds/`+props.id,{
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response)=> response.data.data);
})

//POST A COMMENT
export const postComment = createAsyncThunk("POST/postComment", async (props) => {
  const commentData = {
    artist: props.artist,
    profileUrl: props.profileUrl,
    comment: props.comment,
    id: props.feedid,
    modifiedAt:props.modifiedAt,
  }
  const data = {
    comment: props.comment,
    modifiedAt:props.modifiedAt,
  }
  await axios
  .post(`${SERVER_URL}/feeds/`+props.feedid,data,{
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => {
  });

  return commentData;
}) 

//EDIT A COMMNET
export const editAComment = createAsyncThunk("PUT/editComment", async (props) => {
  const editedComment = {
    feedid: props.feedid,
    comment: props.comment,
    commentid: props.commentid,
    modifiedAt: props.modifiedAt,
    token: props.token,
  }
  const data = {
    comment: props.comment,
    modifiedAt: props.modifiedAt,
  }
  await axios
  .put(`${SERVER_URL}/feeds/`+props.feedid+`/`+props.commentid,data, {
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => response.data.data)

  return editedComment;
})

//DELETE A COMMENT
export const deleteComment = createAsyncThunk("DELETE/deleteComment", async (props) => {
  const deletedComment ={
    feedid: props.feedid,
    commentid: props.commentid,
  }

  await axios
  .delete(`${SERVER_URL}/feeds/`+props.feedid+`/`+props.commentid, {
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => response.data.data)

  return deletedComment;
})


//LIKE ACTION
export const likeSong = createAsyncThunk("POST/likeSong", async (props) => {
  await axios
  .post(`${SERVER_URL}/like/`+props.feedid,{},{
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => response.data.data);

  return props;
})

//SEARCH MUSIC
export const searchMusic = createAsyncThunk("GET/searchMusic", async (props)=>{
  return await axios
  .get(`${SERVER_URL}/search?keyword=${props}`, {
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => response.data)
})

//FOLLOW
export const followAnArtist = createAsyncThunk("POST/followAnArtist", async (props)=>{
  await axios
  .post(`${SERVER_URL}/follow?artist=${props.artist}`,{}, {
    headers: {Authorization:props.token? props.token:""}
  })
  .then((response) => 
  console.log(response.data));
  
  return props;
})

const SongSlice = createSlice({
  name: "Song",
  initialState: {
    
    list: [{}],

  },

  reducers: {


  },
  extraReducers: {
    // middlewares
    [getMainLists.fulfilled]: (state, action) => {
      state.genreList = [...action.payload.genreList];
      state.latestList = [...action.payload.latestList];
      state.likeList = [...action.payload.likeList];
      state.videoList = [...action.payload.videoList];
    },
    [getMainLists.rejected]: (state, action) => {
    },
    [getMusicFeed.fulfilled]: (state, action) => {
      state.allList = [...action.payload];
    },
    [getMusicFeed.rejected]: (state, action) => {
    },
    [getSongDetail.fulfilled]: (state, action) => {
      state.detail = action.payload.feed;
      state.comments = [...action.payload.comment];
    },
    [getSongDetail.rejected]: (state, action) => {
    },
    [postComment.fulfilled]: (state, action) => {
      // state.detail = action.payload.feed;
      state.comments = [...current(state.comments),action.payload];
    },
    [postComment.rejected]: (state, action) => {
    },
    [editAComment.fulfilled]: (state, action) => {
      const new_list = current(state.comments).map((comment,index) => {
        if (comment.id === action.payload.commentid){
          return {...comment, comment: action.payload.comment}
        } else{
          return comment;
        }
      })
      state.comments = new_list;
    },
    [editAComment.rejected]: (state, action) =>{
    },
    [deleteComment.fulfilled]: (state, action) => {
      const new_list = current(state.comments).filter(
        (comment) => comment.id !== action.payload.commentid
      );
      state.comments = new_list;
    },
    [deleteComment.rejected]: (state, action) =>{
    },
    [likeSong.fulfilled]: (state, action) => {
      if (action.payload.isLiked === false) {
        const new_detail = {...current(state.detail), likeCount:action.payload.likeCount+1, flag:true }
        state.detail = new_detail;
      } else {
        const new_detail = {...current(state.detail), likeCount:action.payload.likeCount-1, flag:false }
        state.detail = new_detail;
      }      
    },
    [likeSong.rejected]: (state, action) => {
    },
    [searchMusic.fulfilled]: (state, action) => {

      state.result_artist = action.payload.artistList;
      state.result_musicArtist = action.payload.musicArtist;
      state.result_musicTitle = action.payload.musicTitle;
      state.result_videoArtist = action.payload.videoArtist;
      state.result_videoTitle = action.payload.videoTitle;

      

    },
    [searchMusic.rejected]: (state, action) => {
    },
    [followAnArtist.fulfilled]: (state, action) =>{
    },
    [followAnArtist.rejected]: (state, action) =>{
    }

  }
})

export default SongSlice.reducer;