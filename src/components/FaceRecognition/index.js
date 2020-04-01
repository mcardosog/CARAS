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
        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        const organization = this.props.children.organization;
        const eventID = this.props.children.event;

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

            //CHECK IF ELEMENT ID WAS ENTERED
            const userID = document.getElementById("userId").value;
            if(userID == '') {
                alert("Please enter an user id");
                return;
            }

            //GET USER INFO, EVENT INFO AND VERIFY IF IT IS ALLOWED
            const userInfo = await fb.getUserInformation(organization,userID);
            if(userInfo == null) {
                alert("Invalid user id");
                return;
            }

            const eventInfo = await fb.getEventInformation(organization,eventID);
            if(eventInfo.notAllowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }
            if(eventInfo.minimumLevel > userInfo.level && !eventInfo.allowedUsers.includes(userID)) {
                alert('USER NOT ALLOWED');
                return
            }

            //LOAD DESCRIPTOR SET AND VERIFY IF IT IS VALID
            const descriptorSet =  await (loadUserDescriptor(userID));
            if(descriptorSet == null || descriptorSet.length == 0) {
                alert("Invalid user id");
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

            //CREATE THE FACE MATCHER AND MATH THE DESCRIPTORS
            const faceMatcher = await new faceapi.FaceMatcher(descriptorSet, 0.6);
            const displaySize = { width: image.width, height: image.height };
            const resizedDetections = await faceapi.resizeResults(detection, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

            // RECOGNIZE AGE AND GENDER
            const detectionsWithAgeAndGender =  await faceapi.detectAllFaces(image).withAgeAndGender()

            //#region MANAGE RESULT
            const faceAccuracy = (1 - results[0].distance)*100;
            const ageAccuracy = Math.abs(userInfo.age-detectionsWithAgeAndGender[0].age);
            const sexDetection = (detectionsWithAgeAndGender[0].gender == userInfo.sex);

            console.log('FACE ACCURACY: '+faceAccuracy+' %')
            console.log('AGE DIFFERENCE: '+ageAccuracy+' years')
            console.log('SEX DETECTED: '+sexDetection)

            var result = '';

            if(ageAccuracy < 7 && sexDetection) {
                if(faceAccuracy > 55) {
                    console.log('AUTHENTICATION CORRECT')
                    result = 'AUTHENTICATION CORRECT';
                }
                else if (faceAccuracy > 50) {
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
            //#endregion

            if(result != 'AUTHENTICATION CORRECT') {
                console.log('NO RECORDING ATTENDANCE');
                return;
            }

            const respAttendance = await fb.markUserAttendance(organization,eventID,userID);
            console.log(respAttendance);
            if(respAttendance != null) {
                alert('User '+userInfo.firstName+' '+userInfo.lastName+' '+
                        'was registered already at '+ new Date(respAttendance).toLocaleString());
            }
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