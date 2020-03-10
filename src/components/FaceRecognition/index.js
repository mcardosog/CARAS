import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import 'react-html5-camera-photo/build/css/index.css';
//
class Face_Recognition extends Component {
    render() {

        const db = { 1:'Black Widow', 2:'Captain America', 3:'Captain Marvel', 4:'Hawkeye',                  //<----- DEBUG ONLY
                    5:'Jim Rhodes', 6:'Thor', 7:'Tony Stark'};

        /**
         * @param userID
         * @returns {Promise<string[]>} set with user stored images
         */
        async function loadImageSet(userID) {
            if(userID <= 0 || userID >= db.length) {
                return null;
            }
            const path = '/labeled_images';
            return [path+db[userID]+'1.jpg',path+db[userID]+'2.jpg'];
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

            const imageSet = loadImageSet(userID);
            if(imageSet == null) {
                alert("Invalid user id");
                return;
            }

            console.log(imageSet);                                                  //<----- DEBUG ONLY

            console.log(faceapi.nets);                                              //<----- DEBUG ONLY
            document.getElementById("myImg").src = dataUri;               //<----- DEBUG ONLY
            const inputImgEl = document.getElementById("myImg");          //<----- DEBUG ONLY

            let blob = await fetch(dataUri).then(r => r.blob());    //Build Image
            const image = await faceapi.bufferToImage(blob);

            const detection = await faceapi.detectAllFaces(inputImgEl).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected. Please try again.");
                return;
            }

            console.log(detection);                                                 //<----- DEBUG ONLY
        }

        /**
         * Load all modules for the face recognition AI.
         */
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
        ])

        return (
            <div>
                <Camera
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
                <input accept={'text'} id={'userId'}/>
                <img id={'myImg'}/>
            </div>
        );
    }
}
export default Face_Recognition;