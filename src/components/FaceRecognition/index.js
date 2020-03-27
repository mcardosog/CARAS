import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
//
class Face_Recognition extends Component {

    constructor(props, organization) {
        super(props);
        this.state = {
            organization : organization
        }
    }

    render() {
        const organization = 'org1';
        const fb = this.props.firebase;
        /**
         * @param userID
         * @returns {LabeledFaceDescriptors} set with user stored images
         */

        async function loadUserDescriptor(userID) {
            let descriptionSet = await fb.getDescriptors(organization,userID);
            if(descriptionSet.length == 0) { return null; }
            return new faceapi.LabeledFaceDescriptors(userID, descriptionSet);
        }

        /**
         * @param dataUri contains uri of the picture taken from the camera
         * @returns {Promise<void>}
         *
         * Function store the image a compare it with the corresponding userID to verify if it match
         */
        async function handleTakePhoto (dataUri) {

            const userID = document.getElementById("userId").value;
            if(userID == '') {
                alert("Please enter an user id");
                return;
            }

            const descriptorSet =  await (loadUserDescriptor(userID));
            if(descriptorSet == null || descriptorSet.length == 0) {
                alert("Invalid user id");
                return;
            }
            let blob =  await fetch(dataUri).then(r => r.blob());    //Build Image
            const image =  await faceapi.bufferToImage(blob);
            const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected. Please try again.");
                return;
            }

            const faceMatcher = await new faceapi.FaceMatcher(descriptorSet, 0.6);
            const displaySize = { width: image.width, height: image.height };
            const resizedDetections = await faceapi.resizeResults(detection, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            results.forEach((result, i) => {
                console.log( 'Subject '+i+' '+((1 - result.distance)*100)+'%');
            })

            const detectionsWithAgeAndGender =  await faceapi.detectAllFaces(image).withAgeAndGender()
            console.log(detectionsWithAgeAndGender)
            //Yes / No

            //fb.uploadImage('test','1',blob);
        }

        /**
         * Load all modules for the face recognition AI.
         */
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
            faceapi.nets.ageGenderNet.loadFromUri('/models'),

            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
        ])

        return (
            <div id={'MainControl'}>
                <Camera
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
                <div style={{marginLeft:"50%"}}>
                    <div>
                        <p>User ID</p>
                        <input accept={'text'} id={'userId'} />
                    </div>
                    <div>
                        <h2> INFORMATION </h2>
                        <p>Accuracy</p>
                        <p>Age</p>
                        <p>Sex</p>
                    </div>
                </div>
            </div>
        );
    }
}
export default withFirebase(Face_Recognition);