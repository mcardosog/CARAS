import React, { useState } from "react";
import {
    Grid,
    Container,
    Button,
    Divider,
    Header,
    Card,
    Modal
} from "semantic-ui-react";

import EventCard from "../UIComponents/EventCard";
import CreateEventForm from "../UIComponents/CreateEventForm";

export default function EventPanel({ organization, events, addEvent, updateEvents, activateEvent}) {
    const [viewCreateEventForm, setViewCreateEventForm] = useState(false);

    const activeEvents = [];
    const inactiveEvents = [];

    if(events) {
        events.forEach(event => {
            if (event.active){
                activeEvents.push(event);
            }else {
                inactiveEvents.push(event);}
        });
    }

    const closeModal = () => {
        setViewCreateEventForm(false);
    }

    const createEventModal = (
        <Modal
            closeIcon
            onClose={() => setViewCreateEventForm(false)}
            open={viewCreateEventForm}
            size="small"
            closeOnEscape={true}
            closeOnDimmerClick={false}
        >
            <Modal.Header as="h1">New Event</Modal.Header>
            <Modal.Content>
                <CreateEventForm
                    organization={organization}
                    addEvent={addEvent}
                    updateEvents={updateEvents}
                    closeModal = {closeModal}
                />
            </Modal.Content>
        </Modal>
    );

    return (
        <>
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Button
                            content="Add Event"
                            icon="add"
                            labelPosition="left"
                            floated="right"
                            onClick={() => {
                                setViewCreateEventForm(true);
                            }}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>

            <Divider horizontal>
                <Header as="h2">Active Events</Header>
            </Divider>

            <Container>
                <Grid stackable>
                    <Grid.Row verticalAlign="middle">
                        <Card.Group itemsPerRow={3}>
                            {activeEvents &&
                                activeEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index} 
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                    />
                                ))}
                        </Card.Group>
                    </Grid.Row>
                </Grid>
            </Container>

            <Divider horizontal>
                <Header as="h2">Inactive Events</Header>
            </Divider>
            <Container>
                <Grid stackable>
                    <Grid.Row verticalAlign="middle">
                        <Card.Group itemsPerRow={3}>
                            {inactiveEvents &&
                                inactiveEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index} 
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                    />
                                ))}
                        </Card.Group>
                    </Grid.Row>
                </Grid>
            </Container>
            {createEventModal}
        </>
    );
}
