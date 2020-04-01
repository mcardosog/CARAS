import React, { useState } from "react";
import { withFirebase } from '../components/Firebase';

import { Form, Grid, Button } from "semantic-ui-react";

export default function EventForm({organization}) {
    const [values, setValues] = useState({
        id: "",
        name: "",
        code: "",
        active: "",
        minimum_level: "",
        allowed_users: [],
        not_allowed_users: [],
        description: "",
        date: ""
    });

    var formValues = values;

    var onChange = (name, value) => {
        formValues[name] = value;
        console.log(formValues);
        setValues(formValues);
    };

    var onSubmit = async () => {
        console.log(formValues);
        setValues(formValues);

        const eventAdded = await this.props.firebase.addEvent(
            organization,
            values.id,
            values.name,
            values.minimum_level,
            values.allowed_users,
            values.not_allowed_users,
            values.description,
            values.date,
            values.code);
        if(!eventAdded) {
            alert('Event ID already in use. Verify if the event was already entered.');
        }
    };

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Form noValidate onSubmit={onSubmit}>
                        <Form.Group>
                            <Form.Input
                                label="Event Name"
                                name="name"
                                type="text"
                                maxLength="15"
                                // value={values.name}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                            <Form.Input
                                label="Event Code"
                                name="code"
                                type="text"
                                // value={values.code}
                                maxLength="5"
                                onChange={(param, data) => {
                                    onChange(data.name, data.value.toUpperCase());
                                }}
                            />
                        </Form.Group>
                        <Form.TextArea
                            label="Description"
                            name="description"
                            type="text"
                            // value={values.description}
                            onChange={(param, data) => {
                                onChange(data.name, data.value);
                            }}
                        />
                        <Button type="submit">Add Allowed Users</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
