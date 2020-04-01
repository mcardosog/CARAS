import React, { useState } from "react";

import { Form, Grid, Button } from "semantic-ui-react";

export default function EventForm() {
    const [values, setValues] = useState({
        id: "",
        name: "",
        active: "",
        minimum_level: "",
        allowed_users: [],
        description: "",
        date: ""
    });

    var formValues = {
        id: "",
        name: "",
        active: "",
        minimum_level: "",
        allowed_users: [],
        description: "",
        date: ""
    };

    var onChange = (name, value) => {
        formValues[name] = value;
        setValues(formValues);
        console.log(formValues);
    };

    var onSubmit = () => {
        setValues(formValues);
        console.log(values);
    };
    return (
        <Grid>
            <Grid.Row>
                <Grid.Column>
                    <Form noValidate onSubmit={onSubmit}>
                        <Form.Input
                            label="Event Name"
                            name="name"
                            type="text"
                            // value={values.name}
                            onChange={(param, data) => {
                                onChange("name", data.value);
                            }}
                        />
                        <Form.TextArea
                            label="Description"
                            name="description"
                            type="text"
                            // value={values.description}
                            onChange={(param, data) => {
                                onChange("description", data.value);
                            }}
                        />
                        <Button type="submit">Add Allowed Users</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}
