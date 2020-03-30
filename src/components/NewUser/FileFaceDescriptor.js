import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
//
class FileFaceDescriptor extends Component {

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

        async function processPhotos () {
            var count = 0;
            const images = [
                document.getElementById('file0').files,
                document.getElementById('file1').files,
                document.getElementById('file2').files,
                document.getElementById('file3').files,
                document.getElementById('file4').files,
            ];

            for(var i=0; i< images.length; i++) {
                if(images[i].length > 0) {
                    //console.log(images[i][0]);
                    const response = await handlePhoto(images[i][0])
                    if (response) { count++; }
                }
            }

            if(count === 0) {
                alert('You need to upload at least one valid picture');
            }
            else {
                alert('Images processed correctly');
            }
        }

        async function handlePhoto (imgRaw) {
            const image =  await faceapi.bufferToImage(imgRaw);
            const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
            if(detection.length === 0) {
                alert("No face detected one picture "+imgRaw.name);
                return false;
            }
            if(detection.length > 1) {
                alert("More than one face detected on the image "+imgRaw.name);
                return false;
            }
            await fb.insertDescriptor(organization,userID,detection[0].descriptor);
            return true;
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
            <div>
                <p>Select your files</p>
                <br/>
                <input type="file" id="file0" accept={"image/jpeg, image/png"}/>
                <input type="file" id="file1" accept={"image/jpeg, image/png"}/>
                <input type="file" id="file2" accept={"image/jpeg, image/png"}/>
                <input type="file" id="file3" accept={"image/jpeg, image/png"}/>
                <input type="file" id="file4" accept={"image/jpeg, image/png"}/>
                <br/>
                <p>You can upload up to 5 pictures.</p>
                <button onClick={()=> processPhotos()}>Process</button>
            </div>
        );
    }
}
export default withFirebase(FileFaceDescriptor);