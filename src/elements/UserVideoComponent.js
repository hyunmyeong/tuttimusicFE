import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import '../styles/UserVideo.css';

export default class UserVideoComponent extends Component {
    

    getNicknameTag() {
        // Gets the nickName of the user
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    render() {
        return (
            <div>
                {this.props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponent 
                        streamManager={this.props.streamManager}
                        volume={this.props.volume} />
                        <div><p>{this.getNicknameTag()}</p></div>
                    </div>
                ) : null}
            </div>
        );
    }
}
