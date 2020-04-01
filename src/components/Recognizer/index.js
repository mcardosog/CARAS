import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Face_Recognition from "../FaceRecognition";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

class Recognizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
        };
    }

    render() {
        const { users, loading } = this.state;
        return (
            <div>
                <h1>RECOGNIZER</h1>
                <div id={'Controls'}>
                    <p>Company</p>
                    <input/>
                    <p>Event ID</p>
                    <input/>
                    <button>Access the Event</button>
                </div>
                <div id={'FaceRecognition'}>
                    <Face_Recognition children={{'organization':'org1','event':'event1'}}/>
                </div>
            </div>
        );
    }
}
export default withFirebase(Recognizer);