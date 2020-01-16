import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
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
      </div>
    );
  }
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);