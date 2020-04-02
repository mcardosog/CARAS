import React, { useState } from "react";
import { Button, Icon, Card } from "semantic-ui-react";

export default function EventCard({ event, organization, activateEvent, updateEvents, stopEvent }) {
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
                    <Card.Description>{event.description}</Card.Description>
                </Card.Content>
                {/*<Card.Content extra>{attendance}</Card.Content>*/}
            </Card>
        </>
    );
}
