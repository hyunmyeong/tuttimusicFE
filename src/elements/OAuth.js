const CLIENT_ID = "346b2f15b0bcf829529a506449139680";
const REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao";


export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
