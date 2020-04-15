import React, { Component } from 'react';
import * as faceapi from 'face-api.js';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import Camera from 'react-html5-camera-photo';
import { Grid, Message, Icon, Label, Header, Loader, Dimmer, Divider, Button } from 'semantic-ui-react';
//import Webcam from "react-webcam";
//

/*TODO
    - Finish formatting the sucess message
    - Rewrite the formatting of the modal in general to reduce wasted space
*/


class CameraFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            remainingPhotos: 5,
            completed: false,
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

    onClick = async (event) => {
        const {closeModal, updateUsers} = this.props.children;
        closeModal();

        if (updateUsers !== undefined) {
            updateUsers();
        }
    }

    render() {
        const {remainingPhotos, loading} = this.state;
        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        // if(remainingPhotos == 0) {
        //     completed=true;
        //     closeModal();
        //     if (updateUsers !== undefined) {
        //         updateUsers();
        //     }
        // }

        return (
            <Grid
                centered
                container
            >
                <Grid.Row centered>
                    <Grid.Column verticalAlign='middle' textAlign='left'>
                        <Header as='h1'>
                            <span><Icon name='camera' size='large'/> </span>Take Pictures
                        </Header>
                        <Divider/>
                        {remainingPhotos === 0 ?
                        (
                            <Message
                                positive
                                content='Completed!'
                            />
                        ):(
                             <Label color='blue' size='huge' icon ='picture' detail='Pictures Remaining' content={remainingPhotos}/>
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
                                isSilentMode = {true}
                            />
                            <Message
                                size='large'
                                positive
                                hidden={remainingPhotos !== 0}
                            >
                                <Header as='h1'>Completed!</Header>
                                <Button
                                    positive
                                    size='large'
                                    content='Done'
                                    onClick={this.onClick}
                                />
                            </Message>
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