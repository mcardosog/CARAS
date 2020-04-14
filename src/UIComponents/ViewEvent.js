import React, { useState } from "react";

import {Container, Grid, Header, Divider} from 'semantic-ui-react';

export default function ViewEvent ({event}) {

    const {eventDate: date, description, name} = event;

    return (
        <>
        <Container  textAlign='right'>
            <Grid>
                <Grid.Row stretched columns={2}>
                    <Grid.Column textAlign='left'>
                        <Header as='h2' content={name}/>
                    </Grid.Column>
                    <Grid.Column textAlign='right' verticalAlign='middle'>
                        <p>  <b>Starts on: </b>  {date}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Divider/>
            {/* <div>
            <p>  <b>Starts on: </b>  {date}</p>
            <p>Level</p>
            </div> */}
        </Container>
        <Container>
            <b>Description</b>
            <p>{description}</p>
        </Container>
        
        </>
    );
};