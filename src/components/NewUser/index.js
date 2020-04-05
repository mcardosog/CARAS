import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CameraFaceDescriptor from "./CameraFaceDescriptor";
import FileFaceDescriptor from "./FileFaceDescriptor";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';

import {Form, Button, Grid, Modal, Icon} from 'semantic-ui-react';

const genderOptions = [
    {
        key: 'ma',
        value:'Male',
        text: 'Male'
    },
    {
        key: 'fe',
        value:'Female',
        text: 'Female'
    }
]

const levelOptions = [
    {
        key: '1',
        text:'1',
        value:'1'
    },
    {
        key: '2',
        text:'2',
        value:'2'
    },
    {
        key: '3',
        text:'3',
        value:'3'
    },
    {
        key: '4',
        text:'4',
        value:'4'
    },
    {
        key: '5',
        text:'5',
        value:'5'
    }
]

var user = {
    userID: '',
    firstName: '',
    lastName: '',
    email: '',
    level: '',
    gender: '',
    age: ''
}

var answer;
var imageModal;
var confirmationImageModal;

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewImageModal: false,
            viewConfirmationImageModal: false,
            answer: false,
            recognizer: '',
            organization: '',
            user: {
                userID: '',
                firstName: '',
                lastName: '',
                email: '',
                level: '',
                gender: '',
                age: ''
            }
        }
    }

    onSubmit = async (event) => {
        const {
            userID,
            firstName,
            lastName,
            email,
            level,
            gender,
            age
        } = this.state.user;

        // console.log(this.state);
        // const userID = document.getElementById('userID').value;
        // const firstName = document.getElementById('firstName').value;
        // const lastName = document.getElementById('lastName').value;
        // const email = document.getElementById('email').value;
        // const level = document.getElementById('level').value;
        // const gender = document.getElementById('gender').value;
        // const age = document.getElementById('age').value;

        // var error = 'All fields must be filled. Please enter a value for: ';
        // if(userID === '') { error+=' UserID'; }
        // if(firstName === '') { error+=' FirstName'; }
        // if(lastName === '') { error+=' LastName'; }
        // if(email === '') { error+=' Email'; }
        // if(level === '') { error+=' Level'; }
        // if(gender === '') { error+=' Gender'; }
        // if(age === '') { error+=' Age'; }

        // if(error != 'All fields must be filled. Please enter a value for: ') {
        //     alert(error);
        //     return;
        // }

        const organization = this.props.children.organization;
        const userAdded = await this.props.firebase.addUser(organization,userID,firstName,lastName,email,level,gender,age);
        if(!userAdded) {
            alert('User ID already in use. Verify if the user was already entered.')
            return;
        }

        // document.getElementById('userID').disabled = true;
        // document.getElementById('firstName').disabled = true;
        // document.getElementById('lastName').disabled = true;
        // document.getElementById('email').disabled = true;
        // document.getElementById('level').disabled = true;
        // document.getElementById('gender').disabled = true;
        // document.getElementById('age').disabled = true;
        // document.getElementById('addUser').disabled = true;

        // this.props.userUpdate();

        // const answer =  window.confirm("Do you want to use you camera to take user face descriptions? \n If you want to upload the images files press Cancel");
        // if(answer) {
        //     this.setState({
        //         recognizer: <CameraFaceDescriptor children={{'organization':organization,'userID':userID}} />,
        //     });
        // }
        // else {
        //     this.setState({
        //         recognizer: <FileFaceDescriptor children={{'organization':organization,'userID':userID}} />,
        //     });
        // }

        // imageModal = (
        //     <Modal
        //         open={this.state.viewImageModal}
        //         size='large'
        //         closeOnDimmerClick={false}
        //     >
        //         <Modal.Header as='h1' content={answer ? 'Take Pictures' : 'Choose Your Pictures'}/>
        //         <Modal.Content content={
        //             answer
        //                 ? (<CameraFaceDescriptor children={{'organization':organization,'userID':userID}} />)
        //                 : (<FileFaceDescriptor children={{'organization':organization,'userID':userID}} />)
        //             }
        //         />
        //     </Modal>
        // )
        this.setState({viewConfirmationImageModal: true});
    }

    onChange = (event, {name, value}) => {
        user[name] = value
        this.setState({user});
    }

    closeModal = () => {
        this.setState({viewImageModal: false});
    }

    // async componentDidMount () {
    //     confirmationImageModal = (
    //         <Modal
    //             size='mini'
    //             closeOnDimmerClick={false}
    //             open={this.state.viewConfirmationImageModal}
    //         >
    //             <Modal.Header as='h1' content='Picture Information'/>
    //             <Modal.Content>
    //                 <p> How would you like to input your pictures? </p>
    //             </Modal.Content>
    //             <Modal.Actions>
    //                 <Button
    //                     content='Upload My Own Pictures'
    //                 ></Button>
    //                 <Button
    //                     content='Take My Pictures Now'
    //                 ></Button>
    //             </Modal.Actions>
    //         </Modal>
    //     );

    //     imageModal = (
    //         <Modal
    //             open={this.state.viewImageModal}
    //             size='large'
    //             closeOnDimmerClick={false}
    //         >
    //             <Modal.Header as='h1' content={answer ? 'Take Pictures' : 'Choose Your Pictures'}/>
    //             <Modal.Content content={this.state.recognizer}/>
    //         </Modal>
    //     );
    // }


    render() {
        const {
            userID,
            firstName,
            lastName,
            email,
            age,
            gender,
            level } = this.state.user;
        
        const {
            organization,
            viewConfirmationImageModal,
            viewImageModal,
            recognizer,
            } = this.state
                
        const isInvalid =   userID === '' ||
                            firstName === '' ||
                            lastName === '' ||
                            email === '' ||
                            gender === '' ||
                            level === '' ||
                            age === '';

        return (
            <>
                {/* <h1>NEW USERS</h1>
                <div id={'InputControls'}>
                    <p>User ID:</p>
                    <input id={'userID'}/>
                    <p>First Name:</p>
                    <input id={'firstName'}/>
                    <p>Last Name:</p>
                    <input id={'lastName'}/>
                    <p>Email:</p>
                    <input id={'email'}/>
                    <p>Level:</p>
                    <input id={'level'}/>
                    <p>Gender:</p>
                    <input id={'gender'}/>
                    <p>Age:</p>
                    <input id={'age'}/>
                    <br/>
                    <button id={'addUser'} onClick={() => this.addUserClick() }>Insert User</button>
                </div> */}
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Form
                                noValidate
                                onSubmit={this.onSubmit}
                                size='large'
                            >
                                <Form.Group width='equal'>
                                    <Form.Input
                                        fluid
                                        label="First Name"
                                        name="firstName"
                                        type="text"
                                        width={8}
                                        maxLength="25"
                                        value={firstName}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label="Last Name"
                                        name="lastName"
                                        type="text"
                                        width={8}
                                        maxLength="25"
                                        value={lastName}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label="User ID"
                                        name="userID"
                                        type="text"
                                        width={8}
                                        maxLength="15"
                                        value={userID}
                                        onChange={this.onChange}
                                    />
                                    <Form.Select
                                        fluid
                                        label="Level"
                                        name="level"
                                        width={3}
                                        options={levelOptions}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                                <Form.Group widths='equal'>
                                    <Form.Input
                                        fluid
                                        label="Email"
                                        name="email"
                                        type="text"
                                        width={8}
                                        maxLength='40'
                                        value={email}
                                        onChange={this.onChange}
                                    />
                                    <Form.Select
                                        fluid
                                        label="Gender"
                                        name="gender"
                                        width={2}
                                        options={genderOptions}
                                        onChange={this.onChange}
                                    />
                                    <Form.Input
                                        fluid
                                        label="Age"
                                        name="age"
                                        type="text"
                                        value={age}
                                        maxLength="2"
                                        width={2}
                                        onChange={({param: event}, data) => {
                                            //only allow numeric values to be inputted
                                            var regex = (/^[\d]*$/);
                                            if (regex.test(data.value)) {
                                                this.onChange(event, data)
                                            }
                                        }}
                                    />
                                </Form.Group>
                                    <Button
                                        content="Cancel"
                                        size='large'
                                        color="red"
                                        type='button'
                                        icon="cancel"
                                        labelPosition="left"
                                        floated="right"
                                        onClick={()=>{
                                            user = {
                                                userID: '',
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                level: '',
                                                gender: '',
                                                age: ''
                                            }
                                            this.setState(user);
                                            this.props.closeModal();
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        content="Submit"
                                        disabled={isInvalid}
                                        size='large'
                                        color="green"
                                        icon="check"
                                        labelPosition="left"
                                        floated="right"
                                    />            
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            
                <Modal 
                    size='tiny'
                    closeOnDimmerClick={false}
                    open={viewConfirmationImageModal}
                >
                    <Modal.Header>Required Images</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <p> To complete this user's profile, we need a set of pictures for our AI to
                                identify this user upon check in. These pictures are securely stored in our database
                                and will not be shared.
                            </p>
                            <p> How would you like to provide these pictures?</p>
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid
                        stackable={false}
                        >
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Button
                                        primary
                                        icon='camera'
                                        labelPosition='left'
                                        floated='left'
                                        content='Take Pictures'
                                        onClick={()=>{
                                            this.setState({answer: true});
                                            this.setState({recognizer:<CameraFaceDescriptor children={{'updateUsers': this.props.userUpdate,'organization':organization,'userID':userID, 'closeModal': this.props.closeModal}} />})
                                            this.setState({viewConfirmationImageModal: false});
                                            this.setState({viewImageModal: true});

                                        }}
                                    />
                                    <Button
                                        primary
                                        icon='image file'
                                        labelPosition='left'
                                        floated='right'
                                        content='Upload Files'
                                        onClick={()=>{
                                            this.setState({answer: false});
                                            this.setState({recognizer:<FileFaceDescriptor children={{'organization':organization,'userID':userID}} />})
                                            this.setState({viewConfirmationImageModal: false});
                                            this.setState({viewImageModal: true});
                                        }}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Actions>
                </Modal>
        
                <Modal
                    size={answer ? 'large' : 'small'}
                    open={viewImageModal}
                    closeOnDimmerClick={false}
                >
                    <Modal.Content content={recognizer}></Modal.Content>
                </Modal>

                {/* <br/>
                <div id={'FaceDescriptorArea'}>
                    {this.state.recognizer}
                </div> */}
            </>
        );
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(NewUser));