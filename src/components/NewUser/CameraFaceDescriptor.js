import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import Camera from 'react-html5-camera-photo';
import { Grid, Segment, Icon, Label, Header, Loader, Dimmer, Message } from 'semantic-ui-react';
//import Webcam from "react-webcam";
//

class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            remainingPhotos: 5,
            errors:[]
        }
    }

    handleTakePhoto = async (dataUri) => {
        var currentErrors = []
        const {organization, userID} = this.props.children;
        this.setState({loading: true});
        if(this.state.remainingPhotos == 0) {
            return;
        }

        //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
        let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
        const image =  await faceapi.bufferToImage(blob);
        const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

        if(detection.length === 0) {
            currentErrors.push("No face detected. Please try again.");
        }

        if(detection.length > 1) {
            currentErrors.push("Multiple faces detected. Please try again.");
        }

        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        // const organization = this.props.children.organization;
        // const userID = this.props.children.userID;

        if (currentErrors === 0){
            await this.props.firebase.insertDescriptor(organization,userID,detection[0].descriptor);
            this.setState({remainingPhotos:this.state.remainingPhotos-1});
            this.setState({loading: false});
            this.setState({errors: currentErrors})
        } else {
            this.setState({errors: currentErrors})
        }
    }


    render() {
        const {remainingPhotos, loading, errors} = this.state;
        const {updateUsers, closeModal} = this.props.children;

        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        if(remainingPhotos == 0) {
            alert('Completed!');
            closeModal();
            // updateUsers();
        }

        return (
            <Grid
                centered
            >
                <Grid.Row>
                    <Header as='h1' icon ='camera'>
                        Take Pictures
                        <Header.Subheader>
                            Remaining Photos: <Label icon ='picture' content={remainingPhotos}></Label>
                        </Header.Subheader>
                    </Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column stretched>
                        <Dimmer active={loading}>
                            <Loader content='Processing Image...' size='huge'/>
                        </Dimmer>
                            <Camera
                                onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                            />
                            <Message
                            color='red'
                            hidden={(errors.length === 0)}
                            header='Errors Encountered:'
                            list={errors}
                        />  
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            // <div>
            //     <WebcamCapture/>
            //     <p>Remaining Photos: {this.state.remainingPhotos}</p>
            // </div>
        );
    }
}
export default withFirebase(CameraFaceDescriptor);