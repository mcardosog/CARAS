import React from "react";
import {
    Grid,
    Container,
    Button,
    Divider,
    Header,
    Card
} from "semantic-ui-react";

import EventCard from "./EventCard";

export default function EventPanel({ events }) {
    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column>
                        <Button
                            content="Add Event"
                            icon="add"
                            labelPosition="left"
                            floated="right"
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Divider horizontal>
                <Header as="h2">Active Events</Header>
            </Divider>

            <Container>
                <Grid stackable>
                    <Grid.Row verticalAlign="middle">
                        <Card.Group itemsPerRow={3}>
                            {events &&
                                events.map((event, index) => (
                                    <EventCard event={event} key={index} />
                                ))}
                        </Card.Group>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}
