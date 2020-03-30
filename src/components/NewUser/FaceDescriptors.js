import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
//
class FaceDescriptors extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        const organization = this.props.children.organization;
        const userID = this.props.children.userID;
        const fb = this.props.firebase;

        /**
         * @param dataUri contains uri of the picture taken from the camera
         * @returns {Promise<void>}
         *
         * Function store the image a compare it with the corresponding userID to verify if it match
         */
        async function handleTakePhoto (dataUri) {

            //LOAD WEBCAM CAPTURED IMAGE AND BUILD THE DESCRIPTOR SET
            let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
            const image =  await faceapi.bufferToImage(blob);
            const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected. Please try again.");
                return;
            }
            await fb.insertDescriptor(organization,userID,detection[0].descriptor);
            alert('User descriptor inserted!');
        }

        /**
         * Load all modules for the face recognition AI.
         */
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        return (
            <div id={'MainControl'}>
                <Camera
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
            </div>
        );
    }
}
export default withFirebase(FaceDescriptors);