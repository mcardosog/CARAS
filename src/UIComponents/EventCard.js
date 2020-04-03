import React, { useState } from "react";
import { Button, Icon, Card } from "semantic-ui-react";
import GridColumn from "semantic-ui-react/dist/commonjs/collections/Grid/GridColumn";
import GridRow from "semantic-ui-react/dist/commonjs/collections/Grid/GridRow";

export default function EventCard({ event, organization, activateEvent, updateEvents, stopEvent , deleteEvent}) {
    // const [paused, setPaused] = useState(event.active);
    const attendance = (
        <p>
            <Icon name="user" />
            {/*{event.attendance}/{event.totalCount} Attendees*/}
        </p>
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
                    <i className="trash icon" style={{'margin-left':'90%', 'cursor':'pointer'}}
                        onClick={()=>{
                            deleteEvent(organization,event.eventID);
                            updateEvents();
                        }}
                    />
                </Card.Content>
                {/*<Card.Content extra>{attendance}</Card.Content>*/}
            </Card>
        </>
    );
}
