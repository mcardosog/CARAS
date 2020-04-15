import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import Camera from 'react-html5-camera-photo';
import { Grid, Message, Icon, Label, Header, Loader, Dimmer } from 'semantic-ui-react';
//import Webcam from "react-webcam";
//

class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            remainingPhotos: 5
        }
    }

    handleTakePhoto = async (dataUri) => {
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
        this.setState({loading: false});
    }


    render() {
        const {remainingPhotos, loading} = this.state;
        const {updateUsers, closeModal} = this.props.children;
        var completed = false;
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        if(remainingPhotos == 0) {
            loading=false;
            closeModal();
            if (updateUsers !== undefined) {
                updateUsers();
            }
        }

        return (
            <Grid
                centered
                container
            >
                <Grid.Row centered>
                    <Grid.Column stretched textAlign='center'>
                        <Header as='h1' icon>
                            <Icon name='camera'/>
                            Take Pictures
                        </Header>
                        {completed ?
                        (
                            <Message
                                positive
                                content='Completed!'
                            />
                        ):(
                            <Header.Subheader as='h2'>
                                Remaining Pictures: 
                                <Label size='huge' icon ='picture' content={remainingPhotos}/>
                            </Header.Subheader>
                        )}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered>
                    <Grid.Column stretched>
                        <Dimmer active={loading}>
                            <Loader content='Processing Image...' size='huge'/>
                        </Dimmer>
                            <Camera
                                onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
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