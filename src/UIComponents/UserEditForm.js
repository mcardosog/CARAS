import React from "react";
import { withFirebase } from '../components/Firebase';
import { AuthUserContext, withAuthorization } from '../components/Session';

import { Container, Grid, Form, Button } from "semantic-ui-react";

import { genderOptions, levelOptions } from "../util/options";

// var user = {
//   firstName: "Alejandro",
//   lastName: "Alonso",
//   email: "elkasjdlka",
//   gender: "male",
//   age: "asd",
//   level: "12"
// };

class UserEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userID: props.user.userID,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        email: props.user.email,
        gender: props.user.sex,
        age: props.user.age,
        level: props.user.level
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
        userID,
        firstName,
        lastName,
        email,
        level,
        gender,
        age
    } = this.state;

    console.log(this.state);

    const {organization, updateUsers, closeModal, firebase} = this.props;
    console.log(organization);
    const userAdded = await firebase.updateUser(organization,userID,firstName,lastName,email,level,gender,age);
    if (!userAdded) {
        alert("User could not be added");
        return;
    }
    updateUsers();
    closeModal("Edit");
  }

  render() {
    const { firstName, lastName, email, gender, age, level } = this.state;
    return (
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
                            <Form.Select
                                fluid
                                label="Level"
                                name="level"
                                width={3}
                                value={level}
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
                                value={gender}
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
                                    this.setState({});
                                    this.props.closeModal("Edit");
                                }}
                            />
                            <Button
                                type="submit"
                                content="Submit"
                                size='large'
                                color="green"
                                icon="check"
                                labelPosition="left"
                                floated="left"
                            />            
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
  }
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withFirebase(UserEditForm));
