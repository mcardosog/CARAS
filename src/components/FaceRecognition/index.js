import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
//
class Face_Recognition extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const organization = this.props.children.organization;
        const event = this.props.children.event;

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

            const detectionsWithAgeAndGender =  await faceapi.detectAllFaces(image).withAgeAndGender()
            const userInfo = await fb.getUserInformation(organization,userID);

            const faceAccuracy = (1 - results[0].distance)*100;
            const ageAccuracy = Math.abs(userInfo.age-detectionsWithAgeAndGender[0].age);
            const sexDetection = (detectionsWithAgeAndGender[0].gender == userInfo.sex);

            console.log('FACE ACCURACY: '+faceAccuracy+' %')
            console.log('AGE DIFFERENCE: '+ageAccuracy+' years')
            console.log('SEX DETECTED: '+sexDetection)

            var result = '';

            if(ageAccuracy < 5 && sexDetection) {
                if(faceAccuracy > 55) {
                    console.log('AUTHENTICATION CORRECT')
                    result = 'AUTHENTICATION CORRECT';
                }
                else if (faceAccuracy > 45) {
                    console.log('PLEASE TRY AGAIN')
                    result = 'PLEASE TRY AGAIN';
                }
                else {
                    console.log('AUTHENTICATION FAILED')
                    result = 'AUTHENTICATION FAILED';
                }
            }
            else {
                console.log('AUTHENTICATION FAILED')
                result = 'AUTHENTICATION FAILED';
            }

            document.getElementById("ResultText").innerHTML = 'RESULT: '+result;

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
                    <p id={'ResultText'}>RESULT:</p>
                </div>
            </div>
        );
    }
}
export default withFirebase(Face_Recognition);