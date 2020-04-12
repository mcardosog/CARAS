import React from "react";
import { withFirebase } from '../components/Firebase';
import { AuthUserContext, withAuthorization } from '../components/Session';

import { Container, Grid, Form, Button } from "semantic-ui-react";

import { genderOptions, levelOptions } from "../util/options";

class EditEventForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        name: this.props.event.name,
        allowedUsers: this.props.event.allowedUsers,
        notAllowedUsers: this.props.event.notAllowedUsers,
        description: this.props.event.description,
        date: this.props.event.date,
        code: this.props.event.code
    };
  }

  onChange = async (event, { name, value }) => {
    this.setState({
      ...this.state.values,
      [name]: value
    });
  };

  onSubmit = async (event) => {
    const {
        name,
        allowedUsers,
        notAllowedUsers,
        description,
        date,
        code
    } = this.state;

    // const {organization, updateUsers, closeModal, firebase} = this.props;
    // const userAdded = await firebase.updateUser(organization,userID,firstName,lastName,email,level,gender,age);
    // if (!userAdded) {
    //     alert("User could not be added");
    //     return;
    // }
    // updateUsers();
    // closeModal("Edit");
    
  }

  render() {
    const {
        name,
        allowedUsers,
        notAllowedUsers,
        description,
        date,
        code
        } = this.state;
    return (
        <>
        </>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(UserEditForm));
