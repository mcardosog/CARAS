import React from 'react';
import { 
    Button, 
    Form, 
    Grid, 
    Header, 
    Segment 
} from 'semantic-ui-react';

export default function LoginForm({onChange, onSubmit, email, password, error, isInvalid}) {
    return (
        <>
        <Header as ='h2' color ='teal' textAlign = 'center'>Log-in</Header>
        <Form size = 'small' onSubmit={onSubmit} >
            <Segment stacked>
                <Form.Input
                    fuid
                    icon = 'user'
                    name = 'email'
                    type = 'text'
                    value = {email}
                    onChange = {onChange}
                    iconPosition = 'left'
                    placeholder = 'email@host.com'
                />
                <Form.Input
                    fluid = 'true'
                    icon = 'lock'
                    name = 'password'
                    value = {password}
                    iconPosition = 'left'
                    onChange = {onChange}
                    placeholder  = 'password'
                    type = 'password'
                />
                <Button 
                    color = 'teal'
                    fluid
                    disabled = {isInvalid}
                    type = 'submit'
                    size = 'large'
                >Login</Button>
            </Segment>
            {error && <p>{error.message}</p>}
        </Form>
        </>
    );
};