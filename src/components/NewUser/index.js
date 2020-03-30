import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import FaceDescriptors from "./FaceDescriptors";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';

class NewUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recognizer: ''
        }
    }

    async addUserClick() {

        const userID = document.getElementById('userID').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const level = document.getElementById('level').value;
        const gender = document.getElementById('gender').value;
        const age = document.getElementById('age').value;

        var error = 'All fields must be filled. Please enter a value for: ';
        if(userID === '') { error+=' UserID'; }
        if(firstName === '') { error+=' FirstName'; }
        if(lastName === '') { error+=' LastName'; }
        if(email === '') { error+=' Email'; }
        if(level === '') { error+=' Level'; }
        if(gender === '') { error+=' Gender'; }
        if(age === '') { error+=' Age'; }

        if(error != 'All fields must be filled. Please enter a value for: ') {
            alert(error);
            return;
        }
        const organization = 'org1'//this.props.children.organization;
        const userAdded = await this.props.firebase.addUser(organization,userID,firstName,lastName,email,level,gender,age);
        if(!userAdded) {
            alert('User ID already in use. Verify if the user was already entered.')
            return;
        }
        this.setState({
            recognizer: <FaceDescriptors children={{'organization':organization,'userID':userID}} />,
        });
    }

    render() {
        return (
            <div>
                <h1>NEW USERS</h1>
                <div>
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
                    <button onClick={() => this.addUserClick() }>Insert User</button>
                </div>
                <br/>
                <div id={'FaceDescriptorArea'}>
                    {this.state.recognizer}
                </div>
            </div>
        );
    }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(NewUser));