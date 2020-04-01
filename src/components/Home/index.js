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
            addEvent: null,
            events: [],
            updateEvents: null,
        }
    }

    async componentDidMount() {
        const organization = await this.props.firebase.getOrganization();
        const events = await this.props.firebase.getEventsPreview(organization);
        const addEvent = this.props.firebase.addEvent;
        const updateEvents  = async () => {
            const events =  await this.props.firebase.getEventsPreview(this.state.organization);
            this.setState({ events: events });
        }
        this.setState({
            organization: organization,
            events: events,
            addEvent : addEvent,
            updateEvents: updateEvents,
        });
    }

    render() {
        const {organization, events, addEvent, updateEvents} = this.state;
        return (
            <>
                <EventPanel
                    events={events}
                    organization={organization}
                    addEvent={addEvent}
                    updateEvents={ updateEvents }
                />
            </>
        )
    }

}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);

