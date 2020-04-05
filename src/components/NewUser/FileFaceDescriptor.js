import React, { Component } from 'react';
import Camera from 'react-html5-camera-photo';
import * as faceapi from 'face-api.js';
import * as canvas from 'canvas';
import { withFirebase } from '../Firebase';
import 'react-html5-camera-photo/build/css/index.css';
import { Divider, Grid, Header, Form, Button, Icon } from 'semantic-ui-react';


var constructorImages = new Array(5);

class FileFaceDescriptor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: constructorImages
        }
    }

    render() {
        //TAKEN FROM CHILDREN IN THE CONSTRUCTOR
        const {organization, userID} = this.props.children;
        // const organization = this.props.children.organization;
        // const userID = this.props.children.userID;
        const fb = this.props.firebase;


        async function onSubmit () {
            var count = 0;
            const {images} = this.state;
            // const images = [
            //     document.getElementById('file0').files,
            //     document.getElementById('file1').files,
            //     document.getElementById('file2').files,
            //     document.getElementById('file3').files,
            //     document.getElementById('file4').files,
            // ];

            for(var i=0; i< images.length; i++) {
                if(images[i].length > 0) {
                    const response = await handlePhoto(images[i])
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

        

        Promise.all([
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        ])

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
                        onSubmit={onSubmit}
                    >
                        <Form.Input
                            type='file'
                            name='0'
                            multiple
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                console.log(param.target.files);
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='1'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='2'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='3'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='4'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Form.Input
                            type='file'
                            name='5'
                            accept={'image/jpeg, image/png'}
                            onChange={(param, data)=>{
                                constructorImages[data.name] = param.target.files[0];
                                this.setState({images: constructorImages});
                            }}
                        />
                        <Button
                            type='submit'
                            icon='upload'
                            labelPosition='right'
                            content='Upload'
                        />                        
                    </Form>
                </Grid.Row>
            </Grid>
        );
    }
}
export default withFirebase(FileFaceDescriptor);