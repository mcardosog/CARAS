import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import { Divider, Grid, Header, Form, Button, Icon } from 'semantic-ui-react';


var constructorImages = new Array();

class FileFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: []
        }
    }

    onSubmit = async() => {
        var count = 0;
        const {images} = this.state;

        // const images = [
        //     document.getElementById('file0').files,
        //     document.getElementById('file1').files,
        //     document.getElementById('file2').files,
        //     document.getElementById('file3').files,
        //     document.getElementById('file4').files,
        // ];

        for (var i = 0; i< images.length; i++) {
            const response = await this.handlePhoto(images[i])
            if (response) {
                count++;
            }
        }

        if(count === 0) {
            alert('You need to upload at least one valid picture');
        }
        else {
            alert('Images processed correctly');
        }
    }

    handlePhoto = async (imgRaw) => {
        const image =  await faceapi.bufferToImage(imgRaw);
        const detection =  await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
        const {organization, userID} = this.props.children;
        const fb = this.props.firebase;

        if(detection.length === 0) {
            alert("No face detected on the image " + imgRaw.name);
            return false;
        }
        if(detection.length > 1) {
            alert("More than one face detected on the image " + imgRaw.name);
            return false;
        }
        await fb.insertDescriptor(organization,userID,detection[0].descriptor);
        return true;
    }

    

    render() {
        var isValid = (this.state.images.length == 5) ? true : false;

        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        // const {organization, userID} = this.props.children;
        // // const organization = this.props.children.organization;
        // // const userID = this.props.children.userID;
        // const fb = this.props.firebase;

        return (
            // <div>
            //     <p>Select your files</p>
            //     <br/>
            //     <input type="file" id="file0" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file1" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file2" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file3" accept={"image/jpeg, image/png"}/>
            //     <input type="file" id="file4" accept={"image/jpeg, image/png"}/>
            //     <br/>
            //     <p>You can upload up to 5 pictures.</p>
            //     <button onClick={()=> processPhotos()}>Process</button>
            // </div>

            <Grid>
                <Grid.Row>
                    <Header textAlign='center' as='h1' icon>
                        <Icon name='image file'/>
                        Upload Your Pictures
                    </Header>
                </Grid.Row>
                <Divider/>
                <Grid.Row centered>
                    <Form
                        onSubmit={this.onSubmit}
                    >
                        <Form.Input
                            type='file'
                            name='0'
                            multiple
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                // console.log(param.target.files);
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='1'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[1] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='2'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[2] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='3'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[3] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='4'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[4] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Button
                            type='submit'
                            icon='upload'
                            labelPosition='right'
                            content='Upload'
                            primary
                            disabled={!isValid}
                        />                        
                    </Form>
                </Grid.Row>
            </Grid>
        );
    }
}
export default withFirebase(FileFaceDescriptor);