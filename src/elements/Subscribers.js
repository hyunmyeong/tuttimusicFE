import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import UserVideoComponent from './UserVideoComponent';
import BeatLoader from "react-spinners/BeatLoader";
import {withRouter} from '../elements/withRouter';
import styled from "styled-components";
import {FaVolumeUp, FaVolumeOff, FaVolumeDown, FaVideo} from "react-icons/fa";
import { IconContext } from "react-icons";

const OPENVIDU_SERVER_URL = 'https://' + "rnrn.shop" ;

const OPENVIDU_SERVER_SECRET = 'qlalfqjsgh';


class Subscribers extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)

        this.state = {
            mySessionId: this.props.session,
            myUserName: this.props.subscriber,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
            streamSound: true,
            volume: 0.5,
            spinner:true,
            
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleChangeUserName = this.handleChangeUserName.bind(this);
        this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.navigator = this.navigator.bind(this);
        // this.muteAudio = this.muteAudio.bind(this);  
        this.handleVolume = this.handleVolume.bind(this); 
        this.showSpinner = this.showSpinner.bind(this);        
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
        this.joinSession();
        this.showSpinner();
    } 

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        if(window.confirm("방을 나가시면 라이브가 종료됩니다. 라이브를 종료하시겠어요?")) {
            this.leaveSession();
        };
        this.leaveSession();
    }

    // muteAudio(){
    //     if(this.state.streamSound===true) {
            
    //         this.setState({
    //         // sound: false,
    //         volume: 0.3
    //     });
    //     }

    //     if(this.state.streamSound===false) {
    //         this.setState({
    //         sound: true,
    //     });
    //     let b = this.state.subscribers[0]
    //     b.subscribeToAudio(true)
    //     } 
        
    // } 

    handleVolume(e){
        console.log(e.target.value)
        let newVolume = +e.target.value
        
        if (newVolume){
            this.setState({
            volume: newVolume,
        });
        }
    }

    showSpinner(){
        setTimeout(() =>{
            this.setState({
            spinner:false,
        });
        },1000)
        
    }

    navigator(){
        this.props.navigate('/livelist')
    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleChangeUserName(e) {
        this.setState({
            myUserName: e.target.value,
        });
    }

    handleMainVideoStream(stream) {
        if (this.state.mainStreamManager !== stream) {
            this.setState({
                mainStreamManager: stream
            });
        }
    }

    deleteSubscriber(streamManager) {
        let subscribers = this.state.subscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1) {
            subscribers.splice(index, 1);
            this.setState({
                subscribers: subscribers,
            });
        }
    }

    joinSession() {
        // --- 1) Get an OpenVidu object ---

        this.OV = new OpenVidu();

        // --- 2) Init a session ---

        this.setState(
            {
                session: this.OV.initSession(),
            },
            () => {
                
                var mySession = this.state.session;
                console.log(mySession)
                // --- 3) Specify the actions when events take place in the session ---

                // On every new Stream received...
                mySession.on('streamCreated', (event) => {
                    // Subscribe to the Stream to receive it. Second parameter is undefined
                    // so OpenVidu doesn't create an HTML video by its own
                    var subscriber = mySession.subscribe(event.stream, undefined);
                    var subscribers = this.state.subscribers;
                    subscribers.push(subscriber);

                    // Update the state with the new subscribers
                    this.setState({
                        subscribers: subscribers,
                    });
                    console.log(subscribers)
                });

                // On every Stream destroyed...
                mySession.on('streamDestroyed', (event) => {

                    // Remove the stream from 'subscribers' array
                    this.deleteSubscriber(event.stream.streamManager);
                });

                // On every asynchronous exception...
                mySession.on('exception', (exception) => {
                    console.warn(exception);
                });

                // --- 4) Connect to the session with a valid user token ---

                // 'getToken' method is simulating what your server-side should do.
                // 'token' parameter should be retrieved and returned by your own backend
                this.getToken().then((token) => {
                    // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                    mySession
                        .connect(
                            token,
                            { 
                                clientData: this.state.myUserName,
                                role: "SUBSCRIBER",
                             },
                        )
                        .then(async (response) => {
                            console.log(response);
                            // var devices = await this.OV.getDevices();
                            // var videoDevices = devices.filter(device => device.kind === 'videoinput');

                            // // --- 5) Get your own camera stream ---

                            // // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                            // // element: we will manage it on our own) and with the desired properties
                            // let publisher = this.OV.initPublisher(undefined, {
                            //     audioSource: undefined, // The source of audio. If undefined default microphone
                            //     videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                            //     publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                            //     publishVideo: true, // Whether you want to start publishing with your video enabled or not
                            //     resolution: '640x480', // The resolution of your video
                            //     frameRate: 30, // The frame rate of your video
                            //     insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                            //     mirror: false, // Whether to mirror your local video or not
                            // });

                            // // --- 6) Publish your stream ---

                            // mySession.publish(publisher);

                            // // Set the main video in the page to display our webcam and store our Publisher
                            // this.setState({
                            //     currentVideoDevice: videoDevices[0],
                            //     mainStreamManager: publisher,
                            //     publisher: publisher,
                            // });
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    leaveSession() {
        this.navigator()
        // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            mainStreamManager: undefined,
            publisher: undefined
        });

    }

    async switchCamera() {
        try{
            const devices = await this.OV.getDevices()
            var videoDevices = devices.filter(device => device.kind === 'videoinput');

            if(videoDevices && videoDevices.length > 1) {

                var newVideoDevice = videoDevices.filter(device => device.deviceId !== this.state.currentVideoDevice.deviceId)

                if (newVideoDevice.length > 0){
                    // Creating a new publisher with specific videoSource
                    // In mobile devices the default and first camera is the front one
                    var newPublisher = this.OV.initPublisher(undefined, {
                        videoSource: newVideoDevice[0].deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true
                    });

                    //newPublisher.once("accessAllowed", () => {
                    await this.state.session.unpublish(this.state.mainStreamManager)

                    await this.state.session.publish(newPublisher)
                    this.setState({
                        currentVideoDevice: newVideoDevice,
                        mainStreamManager: newPublisher,
                        publisher: newPublisher,
                    });
                }
            }
          } catch (e) {
            console.error(e);
          }
    }

    render() {
        
        return (
            <div className="container">
                {this.state.spinner===true ? (
                <div className="spinner-wrap-solid">
                <div className="mgbottom15">
                    <IconContext.Provider value={{ className: "video-cam active" }}>
                        <FaVideo/>
                    </IconContext.Provider>
                </div>
                <BeatLoader color={"#8A51FB"} loading={true} size={10}/>
                </div>
                ) : null}

                {this.state.subscribers.length >0 ? (
                    <div id="session">
                        <div className="flex-column">
                            {this.state.subscribers.map((sub, i) => (
                                <div id="main-video" className="col-md-6">                                    
                                    <UserVideoComponent streamManager={sub} volume={this.state.volume}/>
                                </div>
                            ))}                       
                        
                            <div className="video-control-box">
                            <Controls className="controls" >
                                {this.state.volume > 0.01 && this.state.volume < 0.5 ? <FaVolumeDown id="volume-icon"/> 
                                : this.state.volume >= 0.5? <FaVolumeUp id="volume-icon"/>
                                : <FaVolumeOff id="volume-icon"/>}
                                <input                                 
                                type="range" 
                                id="volume-range"
                                min="0.01"
                                max="1"
                                step="0.05"
                                onChange={this.handleVolume}
                                value={this.state.volume}
                                />  
                            </Controls>   
                            </div> 
                        </div>
                    </div>

                ) : 
                <div className="session-finished">
                        <p className="font20"> 
                            방송이 종료되었어요. <br/>
                            다른 라이브 방송을 보러 가볼까요? 😋
                        </p>
                        <button
                            className="btn-live3"
                            id="buttonLeaveSession"
                            onClick={this.leaveSession}
                        >
                        라이브 목록으로 나가기
                        </button>
                    </div>
                }
                

            </div>
        );
    }

    getToken() {
        return this.createSession(this.state.mySessionId).then((sessionId) => this.createToken(sessionId));
    }

    createSession(sessionId) {
        return new Promise((resolve, reject) => {
            var data = JSON.stringify({ 
                customSessionId: sessionId,
                
            });
            axios
                .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('CREATE SESION', response);
                    resolve(response.data.id);
                })
                .catch((response) => {
                    var error = Object.assign({}, response);
                    if (error?.response?.status === 409) {
                        resolve(sessionId);
                    } else {
                        console.log(error);
                        console.warn(
                            'No connection to OpenVidu Server. This may be a certificate error at ' +
                            OPENVIDU_SERVER_URL,
                        );
                        if (
                            window.confirm(
                                'No connection to OpenVidu Server. This may be a certificate error at "' +
                                OPENVIDU_SERVER_URL +
                                '"\n\nClick OK to navigate and accept it. ' +
                                'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                                OPENVIDU_SERVER_URL +
                                '"',
                            )
                        ) {
                            window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                        }
                    }
                });
        });
    }

    createToken(sessionId) {
        return new Promise((resolve, reject) => {
            var data = {
                role:"SUBSCRIBER",
            };
            axios
                .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection", data, {
                    headers: {
                        Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => {
                    console.log('TOKEN', response);
                    resolve(response.data.token);
                })
                .catch((error) => reject(error));
        });
    }
}

export default withRouter(Subscribers);



let Controls = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
margin: 30px 3px 0px 3px;

    #volume-icon {
    color: #8A51FB;
    }
    input[type=range] {
    width:100px;
    -webkit-appearance: none;
    margin-left:5px;
    }

    input[type=range]:focus {
    outline: none;
    }
    /*webkit (Chrome)의 경우*/
    input[type=range]::-webkit-slider-runnable-track {
    width: 100px;
    height: 10px;
    border-radius: 10px;
    cursor: pointer;
    animate: 0.2s;
    background: #8A51FB;
    }
    input[type=range]::-webkit-slider-thumb {
    border: 1px solid #8A51FB;
    border-radius: 20px;
    height: 20px;
    width: 20px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px; 
    }



`