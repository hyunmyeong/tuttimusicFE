import React, {useRef, useState} from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Modal from '../elements/Modal';
import imageCompression from 'browser-image-compression'; 
import NotFound from './NotFound';
import SEO from '../components/SEO';

const SignUp = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [artist, setArtist] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [image, setImage] = useState(null);
    const [profileText, setProfileText] = useState("");
    const [preview, setPreview] = useState(null);
    
    //초기값을 null로 해야 사각형이 안나옴!
    
    const [insta, setInsta] = useState(null);
    const [youtube, setYoutube] = useState(null);
    const [check, setCheck] = useState(false);
    const [file, setFile] = useState(null);
    const genreNames = ["발라드", "어쿠스틱", "R&B", "힙합", "댄스", "연주곡"]

    //모달
    const [alert, setAlert] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
        };
    const closeModal = () => {
        setModalOpen(false);
        };
    
    //이메일 체크
    const checkEmail = (email) => {
        const regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if (regExp.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    //비밀번호 체크 (4~20글자)
    const checkPw = (pw) => {
        const regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/;
        if (regExp.test(pw)) {
            return true;
        } else {
            return false;
        }
    }

    //  이미지 올리고 미리보기
    const fileChange = (e) => {
        let render = new FileReader()
        if (e.target.files[0]) {
            imgSizeOpt(e.target.files[0])
        }
        

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

    const imgSizeOpt = async (img) => {
    const options = { 
        maxSizeMB: 0.5, 
        maxWidthOrHeight: 250,
    }
    
    try {
        const compressedFile = await imageCompression(img, options);
        setImage(compressedFile);
    } catch (error) {
    }
    }


    //이메일 확인
    const emailCheck = () => {
        if (email === "") {
            setAlert("이메일을 입력하세요!");
            openModal()
            return;
        }
      //이메일 양식이 다를 때
        else if (checkEmail(email) === false) {
            setAlert("이메일 양식을 확인하세요!")
            openModal()
            return;
        }
        else {
        let emailList = {email : email}

        axios
            .post("https://seyeolpersonnal.shop/user/email",emailList)
            .then((response) => {
                if(response) {
                    setAlert("인증 메일이 발송되었습니다. 메일함을 확인해 주세요!")
                    openModal()
                    return;
                }
            })
            .catch((error) => {
                setAlert("중복된 이메일입니다!")
                openModal()
                return;
            })
            }

    }

    //닉네임(아티스트 이름) 확인
    const artistCheck = () => {
        if (artist === "") {
            setAlert("닉네임을 입력하세요!")
            openModal()
            return;
        } else {
            axios
            .post("https://seyeolpersonnal.shop/user/artist",{artist : artist})
            .then((response) => {
                if(response) {
                    setAlert("사용 가능한 닉네임입니다!")
                    openModal()
                }    
            })
            .catch((error) => {
                setAlert("중복된 닉네임입니다!")
                openModal()
            })
        }
    }

    const signupCheck = () => {
        const nullList = [null, null, null, null]
        
        //하나라도 공백일 때
        if (
            email === "" ||
            artist === "" ||
            password === "" ||
            passwordCheck === "" 
        ) {
            setAlert("모든 항목을 입력하세요!"); 
            openModal()   
            return;
        }


        else if (genre.toString() === nullList.toString()) {
            setAlert("장르를 최소 1개 선택해 주세요!")
            openModal()
            return;
        }

      //비밀번호 양식이 다를 때
        else if (checkPw(password) === false || checkPw(passwordCheck) === false) {
            setAlert("비밀번호는 8~20글자 영문+숫자 조합입니다!")
            openModal()
            return;
        }

      //비밀번호가 서로 다를 때
        else if (password !== passwordCheck) {
            setAlert("비밀번호가 서로 달라요!")
            openModal()
            return;
        }

        else if (check===false) {
            setAlert("개인정보처리방침 및 이용약관에 대한 안내에 동의해주세요!")
            openModal()
            return;
        }

        else {
        if (image!==null) {
            const _file = new File([image], artist+".png")
            setFile(_file)
        }  

        //signupdata로 하나로 만들기 + form데이터 형식으로 보내기
        let signupdata = {
            email : email,
            password : password,
            artist : artist,  
            genre : genre,
            profileText : profileText,
            instagramUrl : insta,
            youtubeUrl : youtube,
            genreSelected : clickGenre
        }

        let formData = new FormData();
            formData.append("file", file)
            formData.append("signupData", new Blob([JSON.stringify(signupdata)], {type: "application/json"}))

        axios
            .post("https://seyeolpersonnal.shop/user/signup", formData)
            .then((response) => {
                setAlert("가입이 완료되었어요!")
                openModal()
                navigate('/login')
            })
            .catch((error) => {
                setAlert("이메일 인증 전입니다. 메일함을 확인해 주세요!")
                openModal()
            })
    }}

    const [genre, setGenre] = useState([null, null, null, null]);
    const [clickGenre, setClickGenre] = useState([false, false, false, false, false, false]);
    
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

  if (localStorage.getItem("token")) {
    return (
      <NotFound/>
    )
  }
  


    return (
        <div className='signup-container'>
            <SEO pageTitle={window.location.pathname.substring(1)}/>
            <div className='signup-title-box'>
                <p className='signup-title'>회원가입</p>
                <p className='signup-subtitle'>tutti 회원이 되어 주세요!</p>
            </div>
            <div className='signup-info-box'>
                <div className='signup-info'>
                    {/* 이메일 부분 */}
                    <div className='signup-box'>

                        <label className='signup-label' for="email">
                            <p className='signup-email-title'>이메일<span id="signup-dot">*</span></p>
                        </label>

                        <div className='signup-input-button'>
                            <input className='signup-email-input'
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            type="text"
                            placeholder="이메일을 입력하세요"
                            id="email"
                            name="email"
                            value={email}
                            />
                            <button className='secondary signup-button' onClick={emailCheck}>인증</button>
                        </div>
                    </div>        

                    {/* 비밀번호 부분 */}
                    <div className='signup-box'>

                    <label className='signup-label' for="password">
                            <p className='signup-pw-title'>비밀번호<span id="signup-dot">*</span></p>
                        </label>

                        <div className='signup-pw-content'>
                            <input className='signup-pw-input'
                                onChange={(e)=>{
                                    setPassword(e.target.value)
                                }}   
                                type="password" 
                                placeholder="비밀번호를 입력하세요"
                                name="password"
                                id="password"
                                />
                            <div className='signup-pw-check'>
                                <p className='pw-check'>비밀번호 규칙 : 8~20글자 영문+숫자 조합</p>
                            </div>    
                                <br/>
                        </div>    
                    </div>

                    {/* 비밀번호 확인 부분*/}
                    <div className='signup-box'>

                    <label className='signup-label' for="checkpassword">
                            <p className='signup-pw-title'>비밀번호 확인<span id="signup-dot">*</span></p>
                        </label>

                        <div className='signup-pw-content'>
                            <input className='signup-pw-input'
                                onChange={(e)=>{
                                    setPasswordCheck(e.target.value)
                                }}   
                                type="password" 
                                placeholder="비밀번호를 입력하세요"
                                name="password"
                                id="checkpassword"
                                />
                        </div>    
                    </div>

                    {/* 닉네임 부분 */}
                    <div className='signup-box'>
                    <label className='signup-label' for="artist">
                            <p className='signup-email-title'>닉네임<span id="signup-dot">*</span></p>
                        </label>
                        
                        <div className='signup-input-button'>
                            <input className='signup-email-input'
                                    onChange={(e)=>{
                                        setArtist(e.target.value)
                                    }}
                                    type="text" 
                                    placeholder="닉네임을 입력하세요"
                                    name="artist"
                                    id="artist"
                                    value={artist}
                            />
                            <button className='secondary signup-button' onClick={(artistCheck)}>중복 확인</button></div>

                    </div>
                    
                    {/* 이미지 업로드 부분 */}
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

                    {/* 선호 장르 부분 */}
                    <div className='signup-box'>
                    <label className='signup-label'>
                            <p className='signup-genre-title'>선호 장르<span id="signup-dot">*</span></p>
                        </label>

                        <div className='genre-container'>
                            
                            <div className='genre-boxes'>
                                <GenreBox className='genre-box' clickGenre={clickGenre}>
                                    {
                                        genreNames.map((name, index) => {
                                            return (
                                                <button 
                                                    onClick={()=>
                                                        genrePick(name, index)}
                                                    key = {name}
                                                    className={'genre-category genre'+ index}>
                                                        {name}
                                                </button>
                                            )
                                        }
                                        )
                                    }
                                </GenreBox>
                            </div>
                            
                            
                            <div className='genre-info'>
                                <p className='genre-info-comment'>최대 4개까지 선택 가능합니다.</p>
                            </div>
                            
                            
                        </div>
                    </div>
                    
                    {/* 소개글 부분 */}
                    <div className='signup-box'>
                    <label className='signup-label' for="introduce">
                            <p className='signup-pw-title'>소개글<span id="signup-dot">*</span></p>
                        </label>
                        
                        <input className='signup-pw-input'
                                onChange={(e)=>{
                                    setProfileText(e.target.value)
                                }}   
                                type="text" 
                                placeholder="소개글을 입력하세요"
                                id="introduce"
                                />
                    </div>
                    
                    {/* 인스타 주소 */}
                    <div className='signup-box'>
                    <label className='signup-label' for="insta">
                            <p className='signup-pw-title'>Instagram</p>
                        </label>
                        
                        <input className='signup-pw-input'
                                onChange={(e)=>{
                                    setInsta(e.target.value)
                                }}   
                                type="text" 
                                placeholder="URL을 입력하세요"
                                id="insta"
                                />
                    </div>

                    {/* 유튜브 주소 */}
                    <div className='signup-box'>
                    <label className='signup-label' for="youtube">
                            <p className='signup-pw-title'>Youtube</p>
                        </label>
                        
                        <input className='signup-pw-input'
                            onChange={(e)=>{
                                setYoutube(e.target.value)
                            }}   
                            type="text" 
                            placeholder="URL을 입력하세요"
                            id="youtube"
                        />
                    </div>

                    {/* 약관동의 */}
                    <div className='signup-box'>
                        <div className='checkbox-flex'>
                            <input    
                                className="checkbox-signup"         
                                type="checkbox"
                                id="agree-ckeck"
                                onChange={(e)=>{
                                    setCheck(e.target.checked)
                                }}
                            />
                            <p className='agree-text'>
                            
                                <a 
                                className='linked-text'
                                target="_blank" 
                                href="https://fluoridated-shell-c1f.notion.site/87239be82548471fb8e70efedbd35b5d">
                                    개인정보처리방침</a>
                                및 
                                <a 
                                className='linked-text'
                                target="_blank" 
                                href="https://fluoridated-shell-c1f.notion.site/e88337be613f4069a30b367254d0d71b">
                                    이용약관</a>
                                에 대한 안내에 동의합니다.</p>
                        </div>
                        
                    </div>
                    <button 
                    className='primary signup-button-box' 
                    onClick={(signupCheck)}>회원가입</button>
                    <Modal open={modalOpen} close={closeModal} alert={alert}/>
                </div>
            </div>

            
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

export default SignUp;