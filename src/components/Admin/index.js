import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';
import NewUser from "../NewUser";
import NewEvent from "../NewEvent";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }

  async componentDidMount() {
    const organization = await this.props.firebase.getOrganization();
    this.setState({organization});
  }

  render() {
    const {organization} = this.state;

    return (
        <div>
          <h1>Admin</h1>
          <p>Upload file</p>
          <p>Add User</p>
          <NewUser children={{'organization': organization}}/>

          <p>Add Event</p>
          <NewEvent children={{'organization': organization}}/>
        </div>
    );
  }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);