import React, { Component } from 'react';
import {
    BrowserRouter as Router, Link,
    Route, Switch,
} from 'react-router-dom';
import * as ROUTES from "../../constants/routes";

import {Container, Header, Responsive, Grid, Transition, Segment, Divider} from "semantic-ui-react";


class Landing extends Component {
    state = {
        signOneVisible: false,
        signTwoVisible: false,
        signThreeVisible: false,
        signFourVisible: false,
    };


    componentDidUpdate() {
        if (!this.state.signOneVisible) {
            // when the state is updated (turned red),
            // a timeout is triggered to switch it back off
            this.turnOnTimer = setTimeout(() => {
                this.setState(() => ({signOneVisible: true}))
            }, 700);
        }
        if (!this.state.signTwoVisible) {
            // when the state is updated (turned red),
            // a timeout is triggered to switch it back off
            this.turnOnTimer = setTimeout(() => {
                this.setState(() => ({signTwoVisible: true}))
            }, 1400);
        }
        if (!this.state.signThreeVisible) {
            // when the state is updated (turned red),
            // a timeout is triggered to switch it back off
            this.turnOnTimer = setTimeout(() => {
                this.setState(() => ({signThreeVisible: true}))
            }, 2100);
        }
        if (!this.state.signFourVisible) {
            this.turnOnTimer = setTimeout(() => {
                this.setState(() => ({signFourVisible: true}))
            }, 2800);
        }
    }
    componentWillUnmount() {
    }

    render() {
        let styles = {
            marginTop: '4rem',
        };

        let box = {
            marginTop:'10rem',
            borderStyle: 'solid',
            borderColor: '#0E4D92',
            borderWidth: '1rem',
            marginBottom:'10rem'
        };

        let textStyle = {
            margin: '2rem',
        }

        let footer = {
            position: 'absolute',
            bottom: '0',
            width: '100%',
            height: '35px',
            background: 'black',

        }

        const signOneVisible = this.state.signOneVisible;
        const signTwoVisible = this.state.signTwoVisible;
        const signThreeVisible = this.state.signThreeVisible;
        const signtFourVisible = this.state.signFourVisible;

        return (
            <div>
                <Responsive minwidth={768}>
                    <Grid>
                        <img className="ui fluid image" src="/img/faces5.jpg" alt="Landing Image" />
                    </Grid>
                    <Grid style={styles} centered columns={"equal"} >
                        <Grid.Row centered={true} className="testing">
                            <Grid.Column textAlign={"center"} >
                                <Transition visible={signOneVisible} animation='scale' duration={900}>
                                    <Header as='h2'>Authentication</Header>
                                </Transition>
                            </Grid.Column >
                            <Grid.Column textAlign={"center"}>
                                <Transition visible={signTwoVisible} animation='scale' duration={900}>
                                    <Header as='h2'>Accuracy</Header>
                                </Transition>
                            </Grid.Column>
                            <Grid.Column textAlign={"center"}>
                                <Transition visible={signThreeVisible} animation='scale' duration={900}>
                                    <Header as='h2'>Fast Check-In</Header>
                                </Transition>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid>
                        <Grid.Row centered={true}>
                            <Transition visible={signtFourVisible} animation='scale' duration={900}>
                                <Grid.Column textAlign={"center"} width={4} style={box}>
                                    <Header as='h3' style={textStyle}>Welcome to CARAS! With our application we offer fast and accurate
                                        authentication to events that only certain people can attend using Face Recognition.
                                        Register today!
                                    </Header>
                                </Grid.Column>
                            </Transition>
                        </Grid.Row>
                    </Grid>
                    <Segment inverted vertical style={{ margin: '2.5em 0em 0em', padding: '2.5em 0em' }}>
                    </Segment>
                </Responsive>
            </div>





            // <div>
            //     <div>
            //         LANDING PAGE
            //     </div>
            //     <div>
            //         <button>
            //             <Link to={ROUTES.RECOGNIZER}>RECOGNIZER</Link>
            //         </button>
            //     </div>
            // </div>
        );
    }
}
export default Landing;