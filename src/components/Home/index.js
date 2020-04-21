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
            activateEvent: null,
            stopEvent: null,
            deleteEvent: null,
            loading: true
        }
    }

    async componentDidMount() {
        const organization = await this.props.firebase.getOrganization();
        const events = await this.props.firebase.getEventsPreview(organization);
        const addEvent = this.props.firebase.addEvent;
        const activateEvent = this.props.firebase.activateEvent;
        const stopEvent = this.props.firebase.stopEvent;
        const deleteEvent = this.props.firebase.deleteEvent;
        const updateEvents  = async () => {
            this.setState({loading: true});
            const events =  await this.props.firebase.getEventsPreview(this.state.organization);
            this.setState({ events: events });
            this.setState({loading: false});
        }
        this.setState({
            organization: organization,
            events: events,
            addEvent : addEvent,
            updateEvents: updateEvents,
            activateEvent: activateEvent,
            stopEvent: stopEvent,
            deleteEvent: deleteEvent,
            loading: false
        });
    }

    render() {
        const {organization, events, addEvent, updateEvents, activateEvent, stopEvent, deleteEvent, loading} = this.state;
        return (
            <>
                <EventPanel
                    events={events}
                    organization={organization}
                    addEvent={addEvent}
                    updateEvents={ updateEvents }
                    activateEvent={activateEvent}
                    stopEvent={stopEvent}
                    deleteEvent = {deleteEvent}
                    loading = {loading}
                />
            </>
        )
    }

}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomePage);

