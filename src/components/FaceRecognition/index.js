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

        const fb = this.props.firebase;
        const db = { 1:'Marco', 2:'Captain America', 3:'Captain Marvel', 4:'Hawkeye',                  //<----- DEBUG ONLY
                    5:'Jim Rhodes', 6:'Thor', 7:'Tony Stark', 8:'Adriana'};
        /**
         * @param userID
         * @returns {Promise<string[]>} set with user stored images
         */
        async function loadImageSet(userID) {
            if (userID <= 0 || userID >= db.length) {
                return null;
            }
            const path = '/labeled_images';
            const labels = [db[userID]];
            return Promise.all(
                labels.map(async label => {
                    const descriptions = []
                    var end = 2;
                    for (let i = 1; i <= end; i++) {
                        const img = await faceapi.fetchImage(`${path}/${label}/${i}.jpg`)
                        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                        descriptions.push(detections.descriptor)
                    }
                    return new faceapi.LabeledFaceDescriptors(label, descriptions)
                })
            )
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
            const imageSet = await loadImageSet(userID);
            if(imageSet == null) {
                alert("Invalid user id");
                return;
            }
            let blob = await fetch(dataUri).then(r => r.blob());    //Build Image
            const image = await faceapi.bufferToImage(blob);
            const detection = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected. Please try again.");
                return;
            }

            const faceMatcher = new faceapi.FaceMatcher(imageSet, 0.6);
            const displaySize = { width: image.width, height: image.height };
            const resizedDetections = faceapi.resizeResults(detection, displaySize);
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            //console.log(results);                                                         //<----- DEBUG ONLY
            results.forEach((result, i) => {
                console.log( 'Subject '+i+' '+((1 - result.distance)*100)+'%');
            })

            const detectionsWithAgeAndGender = await faceapi.detectAllFaces(image).withAgeAndGender()
            console.log(detectionsWithAgeAndGender)
            //Yes / No
            fb.uploadImage('test','1',blob);

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
            <div>
                <Camera
                    onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
                />
                <div style={{marginLeft:"50%"}}>
                    <p>User ID</p>
                    <input accept={'text'} id={'userId'} />
                </div>
            </div>
        );
    }
}
export default withFirebase(Face_Recognition);