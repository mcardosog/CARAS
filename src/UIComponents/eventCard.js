import React from "react";
import { Button, Icon, Card, Grid } from "semantic-ui-react";

export default function EventCard({ event }) {
    const attendance = (
        <p>
            <Icon name="user" />
            {event.attendance}/{event.totalCount} Attendees
        </p>
    );

    const deleteEvent = ({ event }) => {
        console.log("deleted: " + event.name);
    };

    return (
        <>
            {/* <Grid.Column> */}
            <Card fluid raised>
                <Card.Content>
                    <Button
                        stackable
                        color="blue"
                        icon="eye"
                        size="tiny"
                        floated="right"
                    />
                    <Button
                        stackable
                        onClick={deleteEvent({ event })}
                        color="red"
                        icon="trash"
                        size="tiny"
                        floated="right"
                    />
                    <Card.Header>{event.name}</Card.Header>
                    <Card.Meta>Created on </Card.Meta>
                    <Card.Description>{event.description}</Card.Description>
                </Card.Content>
                <Card.Content extra>{attendance}</Card.Content>
            </Card>
            {/* </Grid.Column> */}
        </>
    );
}
