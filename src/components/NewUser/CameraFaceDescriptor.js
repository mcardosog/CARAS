import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import Camera from 'react-html5-camera-photo';
import { Grid, Segment, Icon, Label, Header } from 'semantic-ui-react';
//import Webcam from "react-webcam";
//
class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remainingPhotos: 5
        }
    }

    handleTakePhoto = async (dataUri) => {

        const {organization, userID} = this.props.children;

        if(this.state.remainingPhotos == 0) {
            return;
        }

        //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
        let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
        const image =  await faceapi.bufferToImage(blob);
        const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();

        if(detection.length === 0) {
            alert("No face detected. Please try again.");
            return;
        }

        if(detection.length > 1) {
            alert("Multiple faces detected. Please try again.");
            return;
        }

        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        // const organization = this.props.children.organization;
        // const userID = this.props.children.userID;

        await this.props.firebase.insertDescriptor(organization,userID,detection[0].descriptor);
        this.setState({remainingPhotos:this.state.remainingPhotos-1});
    }


    render() {
        const {remainingPhotos} = this.state;
        const {updateUsers, closeModal} = this.props.children;

        if(remainingPhotos == 0) {
            alert('Completed!');
            updateUsers();
            closeModal();
        }

        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

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
                    <Camera
                        onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                    />
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