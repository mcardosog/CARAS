import React, { useState } from "react";
import { withFirebase } from '../components/Firebase';

import { Form, Grid, Button } from "semantic-ui-react";

export default function EventForm({organization, addEvent, updateEvents, closeModal}) {
    const [values, setValues] = useState({
        id: "",
        name: "",
        code: "",
        active: false,
        minimum_level: "",
        allowedUsers: '',
        notAllowedUsers: '',
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
        const eventAdded = await addEvent(
            organization,
            values.id,
            values.name,
            values.minimum_level,
            values.allowedUsers,
            values.notAllowedUsers,
            values.description,
            values.date,
            values.code);
        if(!eventAdded) {
            alert('Event ID already in use. Verify if the event was already entered.');
        }
        closeModal();
        updateEvents();
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
                            <Form.Input
                                label="Event ID"
                                name="id"
                                type="text"
                                // value={values.code}
                                maxLength="10"
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
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
                        <Form.Group>
                            <Form.Input
                                label="Allowed Users"
                                name="allowedUsers"
                                type="text"
                                // value={values.description}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                            <Form.Input
                                label="Not Allowed Users"
                                name="notAllowedUsers"
                                type="text"
                                // value={values.description}
                                onChange={(param, data) => {
                                    onChange(data.name, data.value);
                                }}
                            />
                        </Form.Group>
                        <Button
                            type="submit">Submit</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
