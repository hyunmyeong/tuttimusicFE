import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import React, { Component } from 'react';
import UserVideoComponent from './UserVideoComponent';
import BeatLoader from "react-spinners/BeatLoader";
import {withRouter} from '../elements/withRouter';
import { IconContext } from "react-icons";
import {FaVideo, FaVideoSlash} from "react-icons/fa";
import {MdCameraswitch} from "react-icons/md";
import {BiExit} from "react-icons/bi";
import {BsMicFill, BsMicMuteFill} from "react-icons/bs";


import Modal from '../elements/Modal';

const OPENVIDU_SERVER_URL = 'https://' + "rnrn.shop" ;
const OPENVIDU_SERVER_SECRET = 'qlalfqjsgh';


class Streamers extends Component {

    constructor(props) {
        super(props);
        console.log(this.props)

        this.state = {
            mySessionId: this.props.session,
            myUserName: this.props.streamer,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
            streamers: [],
            havePermissions: false,
            modalOpen: false,
            alert: '라이브 시작 알림을 팔로워들에게 전달했어요!',
            nextStep: false,
            sound: true,
            camera: true,
        };

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.switchCamera = this.switchCamera.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.giveAccess = this.giveAccess.bind(this);
        this.navigator = this.navigator.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.muteAudio = this.muteAudio.bind(this);
        this.muteVideo = this.muteVideo.bind(this);
    }

    componentDidMount() {
        this.giveAccess();
        
    } 

    componentWillUnmount() {
        this.leaveSession();
    }


    muteAudio(){
        
        if(this.state.sound===true) {
            this.setState({
            sound: false,
        });
        let a = this.state.publisher
        a.publishAudio(false)
        }

        if(this.state.sound===false) {
            this.setState({
            sound: true,
        });
        let a = this.state.publisher
        a.publishAudio(true)
        }
        
    }

    muteVideo(){
        if(this.state.camera===true) {
            this.setState({
            camera: false,
        });
        let a = this.state.publisher
        a.publishVideo(false)
        }
        if(this.state.camera===false) {
            this.setState({
            camera: true,
        });
        let a = this.state.publisher
        a.publishVideo(true)
        }
    }
    
    navigator(){
        this.props.navigate('/livelist')
    }

    openModal() {
        this.setState({
            modalOpen: true,
        });
    }

    closeModal(){
        this.setState({
            modalOpen: false,
            nextStep: true,
        });
    }

    handleChangeSessionId(e) {
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleMainVideoStream(stream) {
        if (this.state.mainStreamManager !== stream) {
            this.setState({
                mainStreamManager: stream
            });
        }
    }

    giveAccess() {
        const permissions = navigator.mediaDevices.getUserMedia({audio: true, video: true})
        
        permissions.then((stream) => {           
            this.openModal();   
            this.joinSession();
                    
            
        })
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

                    // var streamer = mySession.subscribe(event.stream, undefined);
                    // var streamers = this.state.streamers;
                    // streamers.push(streamer);

                    var subscriber = mySession.subscribe(event.stream, undefined);
                    console.log(event.stream)
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
                    console.log(token);
                    // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
                    // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
                    mySession
                        .connect(
                            token,
                            { clientData: this.state.myUserName },
                        )
                        .then(async () => {
                            var devices = await this.OV.getDevices();
                            var videoDevices = devices.filter(device => device.kind === 'videoinput');

                            // --- 5) Get your own camera stream ---

                            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
                            // element: we will manage it on our own) and with the desired properties
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: undefined, // The source of audio. If undefined default microphone
                                videoSource: videoDevices[0].deviceId, // The source of video. If undefined default webcam
                                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                                resolution: '640x480', // The resolution of your video
                                frameRate: 30, // The frame rate of your video
                                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                                mirror: false, // Whether to mirror your local video or not
                            });

                            // --- 6) Publish your stream ---

                            mySession.publish(publisher);

                            // Set the main video in the page to display our webcam and store our Publisher
                            this.setState({
                                currentVideoDevice: videoDevices[0],
                                mainStreamManager: publisher,
                                publisher: publisher,
                            });
                            console.log(publisher);
                        })
                        .catch((error) => {
                            console.log('There was an error connecting to the session:', error.code, error.message);
                        });
                });
            },
        );
    }

    leaveSession() {

        const token = localStorage.getItem("token");

        axios
        .delete(`https://seyeolpersonnal.shop/chatRoom/${this.props.streamer}`, {
        headers: {Authorization:token? token:""}
        })
        .then((response)=>{
        console.log(response);
        window.location.reload();
        if (mySession) {
            mySession.disconnect();

        // Empty all properties...
        this.OV = null;
        this.setState({
            mySessionId: undefined,
            myUserName: undefined,
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
            streamers: [],
            havePermissions: false,
        });
        console.log(this.state);
        
        }

        })
        .catch((error)=>{
        console.log(error)
        })

        const mySession = this.state.session;
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
            <>
            <Modal open={this.state.modalOpen} close={this.closeModal} alert={this.state.alert}/>
            <div className="container">
                {this.state.session === undefined ? (
                <div className="spinner-wrap">
                <BeatLoader color={"grey"} loading={true} size={10}/>
                </div>
                ) : null}

                {this.state.session !== undefined ? (
                    <div id="session">                            
                            

                        {this.state.mainStreamManager !== undefined ? (
                            <div className="flex-column">
                                <div id="main-video" className="col-md-6">
                                <UserVideoComponent streamManager={this.state.mainStreamManager} />
                                
                            </div>
                            <div className="video-control-box">                           
                                <div className="video-flex">
                                    <div className="flex-item">
                                        {this.state.camera===true?
                                        <IconContext.Provider value={{ className: "video-cam active" }}>
                                        <button
                                            className="btn-live active"
                                            onClick={this.muteVideo}
                                        >
                                        <FaVideo/>
                                        </button>
                                        </IconContext.Provider>
                                        :
                                        <IconContext.Provider value={{ className: "video-cam" }}>
                                        <button
                                            className="btn-live"
                                            onClick={this.muteVideo}
                                        >
                                        <FaVideoSlash/>
                                        </button>
                                        </IconContext.Provider>
                                        }
                                        

                                        {this.state.sound===true?
                                        <IconContext.Provider value={{ className: "video-mic active" }}>
                                        <button
                                            className="btn-live active"
                                            onClick={this.muteAudio}
                                        >
                                        <BsMicFill/>
                                        </button>
                                        </IconContext.Provider>
                                        :
                                        <IconContext.Provider value={{ className: "video-mic" }}>
                                        <button
                                            className="btn-live"
                                            onClick={this.muteAudio}
                                        >
                                        <BsMicMuteFill/>
                                        </button>
                                        </IconContext.Provider>
                                        }                                     
                                        
                                        <IconContext.Provider value={{ className: "video-change" }}>
                                        <button
                                            className="btn-live active"
                                            id="buttonSwitchCamera"
                                            onClick={this.switchCamera}
                                        >
                                        <MdCameraswitch/>
                                        </button>  
                                        </IconContext.Provider>                                  
                                    </div>                            
                                    <div className="flex-item">
                                        
                                        <IconContext.Provider value={{ className: "video-exit" }}>
                                        <button
                                            className="btn-live2"
                                            id="buttonLeaveSession"
                                            onClick={()=>{
                                                this.leaveSession()
                                                this.navigator() 
                                            }}
                                        >
                                        <BiExit/> <p className='whiteText'>방송 종료</p>
                                        </button>
                                        </IconContext.Provider>
                                    </div>
                                </div>
                                </div>
                            </div>
                        ) :  <p>No mainStreamManager</p>}  

                                                 
                    </div>
                ) : <p>No subscribers</p>}
            </div>
            </>
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
            var data = {};
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

export default withRouter(Streamers);
