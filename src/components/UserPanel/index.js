import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import NewUser from '../NewUser/index';

import { 
    Table, 
    Grid, 
    Container,
    Header, 
    Dimmer, 
    Divider, 
    Icon, 
    Loader, 
    Segment, 
    Modal,
    Button} from 'semantic-ui-react';

class UserPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organization: '',
            users: [],
            addUser: null,
            deleteUser: null,
            updateUsers: null,
            createUserModal: false
        }
    }

    async componentDidMount() {
        const organization = await this.props.firebase.getOrganization();
        const users = await this.props.firebase.getUsersPreview(organization);
        const addUser = this.props.firebase.addUser;
        const deleteUser = this.props.firebase.deleteUser;
        const updateUsers  = async () => {
            const users =  await this.props.firebase.getUsersPreview(this.state.organization);
            this.setState({ users: users });
        }
        this.setState({
            organization: organization,
            users: users,
            addUser : addUser,
            deleteUser: deleteUser,
            updateUsers: updateUsers,
            createUserModal: false
        });
    }

    closeModal = () => {
        this.setState({createUserModal: false});
    }

    render() {
        const {organization, users, addUser, deleteUser, updateUsers, createUserModal} = this.state;
        
        const userModal = (
            <Modal
                closeIcon
                onClose={() => this.setState({createUserModal: false})}
                open={createUserModal}
                size='large'
                closeOnEscape={true}
                closeOnDimmerClick={false}
            >
                <Modal.Header as='h1' content='New User'/>
                <Modal.Content content={<NewUser children={{'organization': organization}} closeModal={this.closeModal} userUpdate={updateUsers} />}/>
            </Modal>
        );
        
        return (
            <>
                <Container>
                    <Grid columns={1} >
                        <Grid.Row>
                            <Header as='h1'>User Panel</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Button
                                    content="Add User"
                                    icon="add"
                                    color="green"
                                    labelPosition="left"
                                    floated="right"
                                    onClick={()=>{
                                        this.setState({createUserModal: true});
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>

                <Divider horizontal>
                <Header as="h2">{organization} Users </Header>
            </Divider>
                <Dimmer active={users ? false : true} inverted>
                <Loader/>
             </Dimmer>
                {users === undefined || users.length === 0 
                ?(
                    <Segment placeholder>
                        <Header icon>
                          <Icon name='inbox' size='large'/>
                          <p>There are currently no users registered</p>
                        </Header>
                    </Segment>
                    )
                :(
                    <Container>
                    <Grid>
                        <Grid.Row>
                            <Table size='large' verticalAlign='middle' celled compact unstackable>
                                <Table.Header>
                                    <Table.Row >
                                        <Table.HeaderCell>First Name </Table.HeaderCell>
                                        <Table.HeaderCell>Last Name  </Table.HeaderCell>
                                        <Table.HeaderCell>Level      </Table.HeaderCell>
                                        <Table.HeaderCell>View      </Table.HeaderCell>
                                        <Table.HeaderCell>Delete      </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {users.map((user, index) => (
                                         <Table.Row key={index}>
                                            <Table.Cell>{user.firstName}</Table.Cell>
                                            <Table.Cell>{user.lastName}</Table.Cell>
                                            <Table.Cell>{user.level}</Table.Cell>
                                            <Table.Cell collapsing textAlign='center'>
                                                <Button
                                                    color='blue'
                                                    icon = "info"
                                                />
                                            </Table.Cell>
                                            <Table.Cell collapsing textAlign='center' >
                                                <Button
                                                    color='red'
                                                    icon = "delete"
                                                    onClick={async () =>{
                                                        deleteUser(organization, user.userID).then(()=>{
                                                            updateUsers();
                                                        })
                                                    }}
                                                />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                             </Table>
                        </Grid.Row>
                    </Grid>
                </Container>
                    )
                }
                {userModal}
            </>
        )
    }

}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(UserPanel);

