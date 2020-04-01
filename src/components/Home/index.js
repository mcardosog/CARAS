import React from 'react';
import { withAuthorization } from '../Session';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import EventPanel from '../../UIComponents/EventPanel';
const events = [
    {
        name: "eventA",
        date: "July, 2020",
        description: "some event i made",
        attendance: 24,
        totalCount: 43
    },
    {
        name: "eventB",
        date: "July, 2058",
        description: "another event i made",
        attendance: 24,
        totalCount: 43
    },
    {
        name: "eventC",
        date: "July, 3000",
        description: "y otro mas event i made",
        attendance: 24,
        totalCount: 43
    }
];

const Home = () => (
    <>
        <EventPanel events={events}/>
    </>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(Home);
