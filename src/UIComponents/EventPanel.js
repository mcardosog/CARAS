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
import EditEventForm from "../UIComponents/EditEventForm";

export default function EventPanel({organization, events, addEvent, updateEvents, activateEvent, stopEvent, deleteEvent}) {

    const [viewCreateEventForm, setViewCreateEventForm] = useState(false);
    const [viewEditEventForm, setViewEditEventForm] = useState(false);
    const [viewEvent, setViewEvent] = useState(false);

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

    const closeModal = (name) => {
        switch(name) {
            case "View":
                setViewEvent(false);
                break;
            case "Edit":
                setViewEditEventForm(false);
                break;   
            case "Create":
                setViewCreateEventForm(false);
                break;                
        }
    }


    const createEventModal = (
        <Modal
            closeIcon
            onClose={() =>{ closeModal("Create")}}
            open={viewCreateEventForm}
            size='large'
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

    const editEventModal = (
        <>
        </>
    );


    // const viewEventModal = (
    //     <Modal
    //         onClose={() =>{ closeModal("Create")}}
    //         open={viewEditEventForm}
    //         size='large'
    //         closeOnEscape={true}
    //         closeOnDimmerClick={false}
    //     >
    //         <Modal.Header as="h1">Edit Event</Modal.Header>
    //         <Modal.Content>
    //             <EditEventForm
    //                 event={selectedEvent}
    //                 organization={organization}
    //                 updateEvents={updateEvents}
    //                 closeModal={closeModal}
    //             />
    //         </Modal.Content>
    //     </Modal>
    // );

    return (
        <>
        <Container>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Button
                            content="Add Event"
                            color='green'
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
                    <Grid.Row >
                        <Grid.Column>
                        <Card.Group centered itemsPerRow={3}>
                            {activeEvents &&
                                activeEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index}
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                        stopEvent = {stopEvent}
                                        deleteEvent = {deleteEvent}
                                    />
                                ))}
                        </Card.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>

            <Divider horizontal>
                <Header as="h2">Inactive Events</Header>
            </Divider>
            <Container>
                <Grid stackable>
                    <Grid.Row>
                        <Grid.Column>
                        <Card.Group centered itemsPerRow={3}>
                            {inactiveEvents &&
                                inactiveEvents.map((event, index) => (
                                    <EventCard 
                                        event={event} 
                                        key={index} 
                                        organization={organization} 
                                        updateEvents={updateEvents} 
                                        activateEvent = {activateEvent}
                                        deleteEvent = {deleteEvent}
                                    />
                                ))
                            }
                        </Card.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            {createEventModal}
            {/* {editEventModal} */}
            {/* {viewEventModal} */}
        </>
    );
}
