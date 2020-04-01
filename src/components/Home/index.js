import React, {Component} from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

import EventPanel from '../../UIComponents/EventPanel'

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organization: '',
            events: []
        }
    }

    async componentDidMount() {
        const organization = await this.props.firebase.getOrganization();
        const events = await this.props.firebase.getEventsPreview(organization);
        const addEvent = this.props.firebase.addEvent;
        this.setState({
            organization: organization,
            events: events,
            addEvent : addEvent
        });
    }

    async updateEvent() {
        const events = await this.props.firebase.getEventsPreview(this.state.organization);
        this.setState({ events: events });
    }

    render() {
        const {organization, events, addEvent} = this.state;

        return (
            <>
                <EventPanel events={events} organization={organization} addEvent={addEvent}/>
            </>
        )
    }

}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);

