import React from 'react';
import {
    Button,
    Form,
    Header,
    Segment,
    Messagem,
    Card
} from 'semantic-ui-react';

export default function EventCard({ event }) {
    const attendance = (
        <p>
            <Icon name="user" />
            {event.attendance}/{event.size} Attendees
        </p>
    );
    return (
        <Grid.Column>
            <Card raised>
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
                        color="red"
                        icon="trash"
                        size="tiny"
                        floated="right"
                    />
                    <Card.Header>{event.name}</Card.Header>
                    <Card.Meta>Created on </Card.Meta>
                    <Card.Description>{event.Description}</Card.Description>
                </Card.Content>
                <Card.Content extra>{attendance}</Card.Content>
            </Card>
        </Grid.Column >
    );
}