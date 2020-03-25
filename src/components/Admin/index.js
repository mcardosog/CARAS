import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import { AuthUserContext, withAuthorization } from '../Session';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }

  render() {
    const { users, loading } = this.state;
    return (
      <div>
        <h1>Admin</h1>
        <p>Upload file</p>
      </div>
    );
  }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);