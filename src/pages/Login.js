import React, {useState, useCallback} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Modal from '../elements/Modal';

const Login = (props) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


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
            // return window.alert("모든 항목을 입력하세요")
            setAlert("모든 항목을 입력하세요!")
            openModal()
        }
        else if (email === "") {
            setAlert("아이디를 입력하세요")
            openModal()
        }
        else if (checkEmail(email) === false) {
            setAlert("이메일 형식을 확인하세요")
            openModal()
        }
        else if (password === "") {
            setAlert("비밀번호를 입력하세요")
            openModal()
        }
        else {

        axios 
            .post("https://seyeolpersonnal.shop/user/login", {
                email : email,
                password : password,
            })
            .then((response) => {
                console.log(response)
                const token = response.headers.authorization;
                const artist = response.data.artist;
                const profileUrl = response.data.profileUrl;
                localStorage.setItem("token", token);
                localStorage.setItem("userName", artist);
                localStorage.setItem("userProfileUrl", profileUrl);
                navigate("/")
                window.location.reload();
            })
            .catch((error) => {
                console.log(error)
                setAlert("로그인 정보를 확인해주세요")
                openModal()
            })
    }
}




    return (
        <div className='login-container'>
            <p className='login-title'>tutti</p>
            <div className='login-info-container'>
                <div className='login-info-box'>
                    <div className='login-info-input'>

                        {/* 이메일 부분 */}
                    <input className='login-email-input'
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
            <Modal open={modalOpen} close={closeModal} alert={alert}/>
            </div>
        </div>  
    )
}



export default Login;