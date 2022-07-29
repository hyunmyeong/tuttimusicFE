import React, {useState, useCallback} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Modal from '../elements/Modal';

import { useMediaQuery } from "react-responsive";

import NotFound from './NotFound';
import SEO from '../components/SEO';
import ImageUrl from '../elements/ImageSrc';
import { RiKakaoTalkFill } from "react-icons/ri";
import { ImBubble } from "react-icons/im";

import {KAKAO_AUTH_URL} from '../elements/OAuth';




const Login = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isMobile = useMediaQuery({
      query : "(max-width:480px)"
    })

    

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

    

    const loginCheck = () => {
        if (email === "" && password === "") {
            setAlert("모든 항목을 입력하세요!")
            openModal()
            return;
        }
        else if (email === "") {
            setAlert("아이디를 입력하세요")
            openModal()
            return;
        }
        else if (checkEmail(email) === false) {
            setAlert("이메일 형식을 확인하세요")
            openModal()
            return;
        }
        else if (password === "") {
            setAlert("비밀번호를 입력하세요")
            openModal()
            return;
        }
        else {

        axios 
            .post("https://seyeolpersonnal.shop/user/login", {
                email : email,
                password : password,
            })
            .then((response) => {
                const token = response.headers.authorization;
                const artist = response.data.artist;
                const profileUrl = response.data.profileUrl;
                localStorage.setItem("token", token);
                localStorage.setItem("userName", artist);
                localStorage.setItem("userProfileUrl", profileUrl);
                navigate("/")


                if (!isMobile) {
                  window.location.reload();
                }
                

            })
            .catch((error) => {
                setAlert("로그인 정보를 확인해주세요")
                openModal()
            })
    }
}

if (localStorage.getItem("token")) {
  return (
    <NotFound/>
  )
}



    return (
        <div className='login-container'>
            <SEO pageTitle={window.location.pathname.substring(1)}/>
            <img
            className="logo1" 
            src={ImageUrl.logo_b}
            />
            <div className='login-info-container'>
                <div className='login-info-box'>
                    <div className='login-info-input'>

                        {/* 이메일 부분 */}
                    <input className='login-email-input'
                        type="email"
                        onChange={(e)=>{
                            setEmail(e.target.value)
                        }}
                        onKeyPress = {(e)=>{
                            if (e.key === 'Enter') {
                                loginCheck()
                            }
                        }}
                        placeholder="이메일 주소를 입력해주세요."/>

                        {/* 비밀번호 부분 */}
                    <input className='login-email-input'
                        onChange={(e)=>{
                            setPassword(e.target.value)
                        }}
                        onKeyPress = {(e)=>{
                            if (e.key === 'Enter') {
                                loginCheck()
                            }
                        }}
                        type="password"
                        placeholder="비밀번호를 입력해주세요."/>
                    </div>
                    <div className='login-info-signup'>
                        <p className='login-tutti-first'>tutti가 처음이신가요?</p>
                        <p className='login-tutti-signup' onClick={()=>{navigate("/signup")}}>회원가입</p>
                    </div>
                </div>
            <button className='primary login-button' onClick={loginCheck}>로그인</button>
            <div className='login-line-wrap'>
            <span className='login-line'></span>
            <span className='login-or'>또는</span>
            <span className='login-line'></span>
            </div>
            <button className='login-button kakao'><a href={KAKAO_AUTH_URL}><ImBubble id="kakao-icon"/>카카오 로그인</a></button>
            <Modal open={modalOpen} close={closeModal} alert={alert}/>
            </div>
        </div>  
    )
}



export default Login;
