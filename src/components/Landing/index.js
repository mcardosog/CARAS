import React, { Component } from 'react';
import {
    BrowserRouter as Router, Link,
    Route, Switch,
} from 'react-router-dom';
import * as ROUTES from "../../constants/routes";


class Landing extends Component {
  render() {
    return (
        <div>
            <div>
                LANDING PAGE
            </div>
            <div>
                <button>
                    <Link to={ROUTES.RECOGNIZER}>RECOGNIZER</Link>
                </button>
            </div>
        </div>
    );
  }
}
export default Landing;