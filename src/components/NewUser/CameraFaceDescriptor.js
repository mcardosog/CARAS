import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
//
class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            remainingPhotos: 5
        }
    }

    handleTakePhoto = async (dataUri) => {

        if(this.state.remainingPhotos == 0) {
            alert('Maximum number of pictures reached.')
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
        const organization = this.props.children.organization;
        const userID = this.props.children.userID;

        await this.props.firebase.insertDescriptor(organization,userID,detection[0].descriptor);
        this.setState({remainingPhotos:this.state.remainingPhotos-1});

    }

    render() {
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        return (
            <div>
                <Camera id={'cameraControl'}
                    onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
                />
                <p>Remaining Photos: {this.state.remainingPhotos}</p>
            </div>
        );
    }
}
export default withFirebase(CameraFaceDescriptor);