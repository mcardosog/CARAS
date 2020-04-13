import React, { useState } from "react";
import { Button, Icon, Card, Modal} from "semantic-ui-react";
import EditEventForm from "../UIComponents/EditEventForm";


export default function EventCard({ event, organization, activateEvent, updateEvents, stopEvent , deleteEvent}) {
    const [viewEditEventForm, setViewEditEventForm] = useState(false);

    const attendance = (
        <p>
            <Icon name="user" />
            {/*{event.attendance}/{event.totalCount} Attendees*/}
        </p>
    );

    const closeModal = (name) => {
        switch(name) {
            // case "View":
            //     setViewEvent(false);
            //     break;
            case "Edit":
                setViewEditEventForm(false);
                break;               
        }
    }

    const openModal = (name) => {
        switch(name) {
            // case "View":
            //     setViewEvent(false);
            //     break;
            case "Edit":
                setViewEditEventForm(true);
                break;               
        }
    }

    const editEventModal = (
        <Modal
            onClose={() =>{ closeModal("Create")}}
            open={viewEditEventForm}
            size='tiny'
            closeOnEscape={true}
            closeOnDimmerClick={false}
        >
            <Modal.Header as="h1">Edit Event</Modal.Header>
            <Modal.Content>
                <EditEventForm
                    event={event}
                    organization={organization}
                    updateEvents={updateEvents}
                    closeModal={closeModal}
                />
            </Modal.Content>
        </Modal>
    );

    return (
        <>
            <Card fluid raised>
                <Card.Content>
                <Button
                    stackable='true'
                    color={(event.active ? "red" : "blue")}
                    icon={(event.active ? "stop" : "play")}
                    onClick={() => {
                        event.active
                            ? (stopEvent(organization,event.eventID))
                            : (activateEvent(organization, event.eventID));
                        updateEvents();
                    }}
                    size="medium"
                    floated="right"
                    />
                    <Card.Header>{event.name}</Card.Header>
                    <Card.Meta>Created on {event.eventDate} </Card.Meta>
                    <Card.Description> {event.description} </Card.Description>
                    {/* <i className="trash icon" style={{'margin-left':'90%', 'cursor':'pointer'}}
                        onClick={()=>{
                            deleteEvent(organization,event.eventID);
                            updateEvents();
                        }}
                    /> */}
                </Card.Content>
                <Card.Content 
                    extra 
                    textAlign='center'
                >
                    <div className='ui two buttons'>
                      <Button  
                        color='blue'
                        content='View'
                        icon='eye'
                        labelPosition='left'
                        onClick={()=>openModal("Edit")}
                    />
                      <Button 
                        color='red'
                        content='Delete'
                        icon='trash'
                        labelPosition='left'
                        onClick={()=>{
                            deleteEvent(organization,event.eventID);
                            updateEvents();
                        }}
                        />
                    </div>
                </Card.Content>
                {/*<Card.Content extra>{attendance}</Card.Content>*/}
            </Card>
            {editEventModal}
        </>
    );
}
