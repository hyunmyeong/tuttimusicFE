import axios from 'axios';
import React, {useEffect, useState, useRef} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../elements/Modal';
import SEO from '../components/SEO';

function MyEdit() {

  const navigate = useNavigate();

  //mypage의 담아져있던 데이터(userInfoDto 값을 state로!)를 받아와서 받아 온 state를 userInfo로 지정  
  const {state} = useLocation();
  const userInfo = state;


  const [userInfoDto, setUserInfoDto] = useState();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(userInfo.profileImage);  

  //모달
  const [alert, setAlert] = useState("")
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
        setModalOpen(true);
        };
  const closeModal = () => {
        setModalOpen(false);
        if (alert === "수정이 완료되었습니다.") {
          navigate('/mypage')
        }
        };

  //수정할 값들
  const [profileText, setProfileText] = useState(userInfo.profileText);
  const [insta, setInsta] = useState(userInfo.instagramUrl);
  const [youtube, setYoutube] = useState(userInfo.youtubeUrl);

  const genreNames = ["발라드", "어쿠스틱", "R&B", "힙합", "댄스", "연주곡"]

  const artist_ref= useRef(null);

  const [myName, setMyName] = useState(false);
  const [checkName, setCheckName] = useState(false);
  const [NewName, setNewName] = useState("");

  const artistCheck = () => {
    const artist = artist_ref.current.value;

    if (artist === "") {
        setAlert("닉네임을 입력하세요.")
        openModal()
        return;
    } else if (artist === userInfo.artist) {
      setAlert("현재 닉네임입니다.")
      openModal()
        return;
    } else {
        axios
        .post("https://seyeolpersonnal.shop/user/artist",{artist : artist})
        .then((response) => {
            if(response) {
                setNewName(artist)
                setAlert("사용 가능한 닉네임입니다.")
                openModal()
            }    
        })
        .catch((error) => {
            setAlert("중복된 닉네임입니다.")
            openModal()
        })
    }
}

const myinfoEdit = () => {
  const artist = artist_ref.current.value;
  const token = localStorage.getItem("token");

  if (NewName !== artist) {
    if (artist !== userInfo.artist) {
      setAlert("변경된 닉네임 중복 확인해 주세요.")
      openModal();
      return;
    }  
  }

  
  const updateData = {
    artist : artist,
    profileText : profileText,
    instagramUrl : insta,
    youtubeUrl : youtube,
    genre : genre,
    genreSelected : clickGenre
  }


  let formData = new FormData();

  formData.append("file", image)
  
  formData.append("updateData", new Blob([JSON.stringify(updateData)], {type: "application/json"}))

    axios
      .put("https://seyeolpersonnal.shop/user/mypage", formData, {
        headers: { Authorization: token ? token : "" }
      })
      .then((response) => {
        console.log(response);
        const artist = response.data.data.artist;
        const profileImage = response.data.data.profileImage;
        localStorage.setItem("userName", artist);
        localStorage.setItem("userProfileUrl", profileImage);
        setAlert("수정이 완료되었습니다.")
        openModal()
      })
      .catch((error) => {
        setAlert("수정되지 않았습니다.")
        openModal()

      })
  

}

  // 이미지 올리고 미리보기
  const fileChange = (e) => {
    let render = new FileReader()
    setImage(e.target.files[0])

    if (e.target.files[0]) {
      render.readAsDataURL(e.target.files[0])
    }

    render.onload = () => {
      const previewImgUrl = render.result

    if (previewImgUrl) {
      setPreview(previewImgUrl)
    }
    } 
}

const [genre, setGenre] = useState(userInfo.genre);
const [clickGenre, setClickGenre] = useState(userInfo.genreSelected);

const genrePick = (name, index) => {
// indexOf 함수는 해당 배열에서 특정 값을 찾을 때 인덱스 숫자로 위치를 알려주고 없으면 -1을 반환
// genre 배열에서 null값이 없어서 -1을 반환할 때 name(장르 이름)으로 가득 찬 상태이므로 알림창 띄우기
if (genre.indexOf(null) === -1 &&  genre.indexOf(name) === -1) {
  setAlert("장르는 최대 4개까지 선택 가능합니다.")
  openModal()
  return;
} else if (genre.indexOf(name) === -1) {
  genre.pop();
  genre.unshift(name);
} else {
  genre.splice(genre.indexOf(name), 1);
  genre.push(null);
}

// genre가 null값의 배열이므로 마지막 null을 지우고 맨 앞에 name(장르 이름)을 넣는 형태

setClickGenre([
  ...clickGenre.slice(0, index),
  !clickGenre[index],
  ...clickGenre.slice(index+1),
]);

}


  return (
    <div className='signup-container'>
      <SEO pageTitle={window.location.pathname.substring(1)}/>
      <div className='signup-title-box'>
        <p className='signup-title'>회원 정보 수정</p>
        <p className='signup-subtitle'>회원 정보를 수정해 주세요!</p>
      </div>

      <div className='signup-info-box'>
        <div className='signup-info '>

          {/* 닉네임  */}
          <div className='signup-box'>
            
          <label className='signup-label'>
              <p className='signup-pw-title'>닉네임</p>
            </label>

          <div className='signup-input-button'>
              <input className='signup-email-input'
                type="text"
                ref={artist_ref}
              placeholder="닉네임을 입력하세요" 
                defaultValue={userInfo.artist}
                />
                <button className='secondary signup-button' onClick={(artistCheck)}>중복 확인</button>
                </div>
          

          </div>

          {/* 프로필 이미지  */}
          <div className='signup-box'>

          <label className='signup-label'>
              <p className='profile-title'>프로필 이미지</p>
            </label>

            <div className='profile-img-form'>
              <img src={preview} className='profile-img-circle'/>
              <label className="secondary profile-img-button" htmlFor="image">이미지 업로드</label>
              <input className='img-button' type="file" id="image" accept='image/*' onChange={fileChange} />
            </div>

          </div>

          {/* 선호 장르  */}
          <div className='signup-box'>

          <label className='signup-label'>
              <p className='signup-genre-title'>선호 장르</p>
            </label>

            <div className='genre-container'>
              <div className='genre-boxes'>
                <GenreBox className='genre-box' clickGenre={clickGenre}>
                  {
                    genreNames.map((name, index) => {
                      return (
                        <button
                          onClick={() =>
                            genrePick(name, index)}
                          key={name}
                          className={'genre-category genre' + index}>
                          {name}
                        </button>
                      )
                    }
                    )
                  }
                </GenreBox>
              </div>
            </div>

          </div>

          {/* 소개글  */}
          <div className='signup-box'>

          <label className='signup-label' for="introduce">
              <p className='signup-pw-title'>소개글</p>
            </label>
            
            <input className='signup-pw-input'
              onChange={(e)=>{
                setProfileText(e.target.value)
                }}
              type="text"
              placeholder='소개글을 입력하세요.'
              id="introduce"
              defaultValue={userInfo.profileText}/>

          </div>

          {/* 인스타  */}
          <div className='signup-box'>

          <label className='signup-label' for="insta">
              <p className='signup-pw-title'>Instagram</p>
            </label>

            <input className='signup-pw-input'
              onChange={(e)=>{
                setInsta(e.target.value)
                }}
              type="text"
              placeholder='URL을 입력해주세요.'
              id="insta"
              defaultValue={userInfo.instagramUrl}/>

          </div>

          {/* 유튜브  */}
          <div className='signup-box'>

          <label className='signup-label' for="youtube">
              <p className='signup-pw-title'>Youtube</p>
            </label>

            <input className='signup-pw-input'
              onChange={(e)=>{
                setYoutube(e.target.value)
                }}
              type="text"
              placeholder='URL을 입력해주세요.'
              id="youtube"
              defaultValue={userInfo.youtubeUrl}/>

          </div>

        </div>

        
      </div>
        <button className='primary signup-button-box' onClick={myinfoEdit}>저장</button>
        <Modal open={modalOpen} close={closeModal} alert={alert}/>
    </div>
  )
}

const GenreBox = styled.div`
    .genre0{
        background-color:${(props) => (props.clickGenre[0] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[0] ? '#fff' : '#000')};
    }
    .genre1{
        background-color:${(props) => (props.clickGenre[1] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[1] ? '#fff' : '#000')};
    }
    .genre2{
        background-color:${(props) => (props.clickGenre[2] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[2] ? '#fff' : '#000')};
    }
    .genre3{
        background-color:${(props) => (props.clickGenre[3] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[3] ? '#fff' : '#000')};
    }
    .genre4{
        background-color:${(props) => (props.clickGenre[4] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[4] ? '#fff' : '#000')};
    }
    .genre5{
        background-color:${(props) => (props.clickGenre[5] ? '#545454' : '#DADADA')};
        color:${(props) => (props.clickGenre[5] ? '#fff' : '#000')};
    }
`


export default MyEdit;