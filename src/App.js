import './styles/App.css';
import './styles/Mq_mobile.css';
import './styles/Mq_smscreen.css';

import React, {useState} from "react";
import { Routes, Route} from "react-router-dom";
import RouteChangeTracker from './elements/RouteChangeTracker';

import Navbar from "./components/Navbar";
import Detail from "./pages/Detail";
import DetailVideo from './pages/DetailVideo';
import Edit from "./pages/Edit";
import Live from "./pages/Live";
import CreateLive from './pages/CreateLive';
import Login from "./pages/Login";
import Main from "./pages/Main";
import MusicFeed from "./pages/MusicFeed";
import MyEdit from "./pages/MyEdit";
import MyPage from "./pages/MyPage";
import SearchResult from "./pages/SearchResult";
import SignUp from './pages/SignUp';
import UploadChoice from './pages/UploadChoice';
import Upload from './pages/Upload';
import UploadVideo from './pages/UploadVideo';
import UserPage from './pages/UserPage';
import FaceChatList from './pages/FaceChatList';
import NotFound from './pages/NotFound';
import EmailCheck from './pages/EmailCheck';
import Player from './components/Player';
import SEO from './components/SEO';
import LoadingLive from './pages/LoadingLive';
import KakaoLogin from './elements/kakaoLogin';

function App() {

  RouteChangeTracker();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [artist, setArtist] = useState(localStorage.getItem("userName"));


  const [data, setData] = useState([]);
  const [value, setValue] = useState(null);

  const [meventSource, msetEventSource] = useState(undefined);

  let eventSource = undefined;

  const date = new Date();

  React.useEffect(() => {


    if (token) {
        
        eventSource = new EventSource(`https://seyeolpersonnal.shop/subscribe/${artist}`); //구독
  
        msetEventSource(eventSource);

        eventSource.addEventListener('open', function(e) {
        })

        eventSource.addEventListener('message', function(e) {
          setData(old => [...old, e.data]);
          setValue(e.data);
        })
      
        eventSource.addEventListener('live', function (e){
          let liveData = JSON.parse(e.data);

          (async () => {
            // 브라우저 알림
            const showNotification = () => {
                
                const notification = new Notification(`${liveData.content}`, {
                    body: data.content
                });
                
                setTimeout(() => {
                    notification.close();
                }, 10 * 1000);
                
                notification.addEventListener('click', () => {
                    window.open(`${liveData.url}`, '_blank');
                });
            }

            // 브라우저 알림 허용 권한
            let granted = false;

            if (Notification.permission === 'granted') {
                granted = true;
            } else if (Notification.permission !== 'denied') {
                let permission = await Notification.requestPermission();
                granted = permission === 'granted';
            }

            // 알림 보여주기
            if (granted) {
                showNotification();
            }
        })();
        }) 

        eventSource.addEventListener('error', function(e) {
          if (e.target.readyState === EventSource.CLOSED) {
          }
        })
  
    }

    return () => {
      eventSource.close();
    };
    
  }, []);


  return (

    <div className="App">
      <SEO/>
      <Navbar/>
        <div className="background">
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/detail/:id" element={<Detail />}></Route>
            <Route path="/detail/video/:id" element={<DetailVideo />}></Route>
            <Route path="/musicfeed" element={<MusicFeed />}></Route>
            <Route path="/mypage" element={<MyPage />}></Route>
            <Route path="/userpage/:artist" element={<UserPage />}></Route>
            <Route path="/myedit" element={<MyEdit />}></Route>
            <Route path="/upload" element={<UploadChoice />}></Route>
            <Route path="/upload/audio" element={<Upload />}></Route>
            <Route path="/upload/video" element={<UploadVideo />}></Route>
            <Route path="/edit/:id" element={<Edit />}></Route>
            <Route path="/live/:artist" element={<Live />}></Route>
            <Route path="/createlive" element={ <CreateLive />}></Route>
            <Route path="/loading/:artist" element={<LoadingLive/>}></Route>
            <Route path="/search" element={<SearchResult />}></Route>
            <Route path="/livelist" element={<FaceChatList/>}></Route>

            <Route path="/emailcheck" element={<EmailCheck/>}></Route>
            
            <Route path="/oauth/callback/kakao" element={<KakaoLogin/>}/>
            <Route path="*" element={<NotFound />}></Route>

          </Routes>
        </div>
      <Player/>
    </div>
  );
}

export default App;
