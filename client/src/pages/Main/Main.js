import React, {Component} from "react";
import Button from "./../../components/button";
import {Row, Col, Container} from "./../../components/Grid";
import Header from "./../../components/Header";
import { Link } from "react-router-dom";
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Paper from 'material-ui/Paper';
import {grey500} from "material-ui/styles/colors";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';



const styles = {
    underlineStyle: {
        borderColor: grey500
    },
    floatingLabelStyle: {
        color: grey500,
    },
    floatingLabelFocusStyle: {
        color: grey500,
    },
    labelWidth: {
        width: '30%'
    }
};

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //have to add the holder for the variables

        };
    };

    render() {
        return (
            <Container fluid>
            <Header/>
                <Row>
                    <Col size="md-6 sm-12">
                        <MuiThemeProvider>
                        <TextField
                            hintText="email"
                            name={"email"}
                            id={"email"}
                            floatingLabelText="Email"
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            width = {styles.labelWidth}
                            fullWidth={false}
                            // onChange={this.getValue}
                        />
                        </MuiThemeProvider>

                    </Col>

                    <Col size="md-6 sm-12">



                    </Col>

                </Row>
            </Container>
        );
    }

};

export default Main;