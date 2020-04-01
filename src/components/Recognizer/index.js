import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import Face_Recognition from "../FaceRecognition";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

class Recognizer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            facerecogition: ''
        }

    }

    async getAccess() {
        const organization = document.getElementById('organization').value;
        const event = document.getElementById('event').value;
        const eventPasscode = document.getElementById('passcode').value;

        await this.props.firebase.deleteEvent('marcoINC','e');


        if(organization.length == 0 || event.length == 0 || eventPasscode.length == 0) {
            alert('Please fill out all the fields.')
            return;
        }
        if(await this.props.firebase.checkIfEventExist(organization,event)) {
            if(await this.props.firebase.loginIntoEvent(organization,event,eventPasscode)) {
                this.setState({
                    facerecogition: <Face_Recognition children={{'organization': organization, 'event': event}}/>
                });
                document.getElementById('Controls').hidden = true;

            }
            else {
              alert('Incorrect event id or passcode')
                return;
            }
        }
        else {
            alert('Unable to locate event');
            return;
        }

    }

    render() {
        return (
            <div>
                <h1>RECOGNIZER</h1>
                <div id={'Controls'}>
                    <p>Company</p>
                    <input id={'organization'}/>
                    <p>Event ID</p>
                    <input id={'event'}/>
                    <p>Event Passcode</p>
                    <input id={'passcode'}/>
                    <button onClick={()=>this.getAccess()}>Access the Event</button>
                </div>
                <div id={'FaceRecognition'}>
                    { this.state.facerecogition }
                </div>
            </div>
        );
    }
}
export default withFirebase(Recognizer);