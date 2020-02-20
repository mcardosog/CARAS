import React from 'react';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
const Home = () => (
    <div>
        HOME
    </div>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(Home);
