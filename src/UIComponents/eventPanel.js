import React from "react";
import { Grid, Container, Button, Divider, Header } from "semantic-ui-react";

import EventCard from "./EventCard";

export default function EventPanel({ events }) {
    console.log(events);
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
                <Grid stackable columns={3}>
                    <Grid.Row verticalAlign="middle">
                        {events &&
                            events.map((event, index) => (
                                <EventCard event={event} key={index} />
                            ))}
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}
