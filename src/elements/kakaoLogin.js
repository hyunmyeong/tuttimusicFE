import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER_URL } from "../redux/modules/songSlice";

function KakaoLogin() {
  const navigate = useNavigate();
  let code = new URL(window.location.href).searchParams.get('code');
  console.log(code);

  React.useEffect(() => {
      axios({
        method: "GET",
        url: `${SERVER_URL}/user/kakao/callback?code=${code}`,
      })
        .then((res) => {
          const token = res.data.jwtToken;
          const artist = res.data.artist;
          const profileUrl = res.data.profileUrl;

          const check = res.data.registerCheck;

          localStorage.setItem("token", token);
          localStorage.setItem("userName", artist);
          localStorage.setItem("userProfileUrl", profileUrl);

          if (check === "firstTime") {
            localStorage.setItem("check", check);
            navigate("/mypage");
          } else {
            navigate("/");  
          }
          
          }).catch((err) => {
          console.log("소셜로그인 에러===>", err);
          window.alert("로그인에 실패하였습니다.");
          navigate("/login");
          return;
          }).finally((res) => {
            console.log("finally===> ", res);
          })
    

  },[])
  return (
    <></>
  )
}

export default KakaoLogin;