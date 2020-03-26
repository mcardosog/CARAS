import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

import { AuthUserContext } from '../Session';

import {
    Menu,
    Dropdown
} from 'semantic-ui-react';

const Navigation = () => (
  <>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth user={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </>
);

const NavigationAuth = ({user}) => (
  <Menu
  inverted
  borderless
  fluid
  >
    <Menu.Menu position='left'>
        <Menu.Item as={Link} to={ROUTES.HOME} icon='home'/>
    </Menu.Menu>
    <Menu.Menu position='right'>
        <Dropdown
          text={user.email}
          item
          floating
          pointing
        >
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to={ROUTES.ACCOUNT}>Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to={ROUTES.ADMIN}>Admin Panel</Dropdown.Item>
            <Dropdown.Item>
              <SignOutButton/>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
    </Menu.Menu>
</Menu>
  // <ul>
  //   <li>
  //     <Link to={ROUTES.LANDING}>Landing</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.HOME}>Home</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.ACCOUNT}>Account</Link>
  //   </li>
  //   <li>
  //     <Link to={ROUTES.ADMIN}>Admin</Link>
  //   </li>
  //   <li>
  //     <SignOutButton />
  //   </li>
  // </ul>
);
const NavigationNonAuth = () => (
    <Menu
      inverted
      borderless
      fluid
    >
        <Menu.Menu position='left'>
            <Menu.Item as={Link} to={ROUTES.LANDING} icon='home'/>
        </Menu.Menu>
        <Menu.Menu position='right'>
            <Menu.Item as={Link} to={ROUTES.SIGN_IN}>Sign-In</Menu.Item>
        </Menu.Menu>
    </Menu>
);

export default Navigation;