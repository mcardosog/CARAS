import React, { useState } from "react";

import { Form, Grid, Button } from "semantic-ui-react";

export default function EventForm() {
    const [values, setValues] = useState({
        id: "",
        name: "",
        code: "",
        active: "",
        minimum_level: "",
        allowed_users: [],
        description: "",
        date: ""
    });

    var formValues = values;

    var onChange = (name, value) => {
        formValues[name] = value;
        console.log(formValues);
        setValues(formValues);
    };

    var onSubmit = () => {
        console.log(formValues);
        setValues(formValues);
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
