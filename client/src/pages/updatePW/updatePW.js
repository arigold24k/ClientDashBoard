import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import withStyles from '@material-ui/core/styles/withStyles';
import functions from '../../functions/functions';
import axios from 'axios';
require('es6-promise').polyfill();


const styles = theme => ({
    modal: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        // justifyContent: 'center',
        // align: 'center',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        textAlign: 'center',
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },

    },
});
class updatePW extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         password: '',
    //         repassword: ''
    //     }
    // }

    state = {
            password: '',
            repassword: ''
    };

    handleSubmit = (event, id) => {
        const encrypPW = functions.encryptPW(this.state.password);
        const dataObj = {
            id,
            pw: encrypPW,
        };
        axios.post('/updateDrowssap', dataObj).then((res) => {
            console.log("Area where the data is coming back from updating password")
        }).catch((err) => {

        });
        return false;
    };
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        })
    };
    render () {
        const {classes} = this.props;
        let id = this.props.match.params.id;
        return (
            <React.Fragment>
                <CssBaseline />
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography variant="h6" gutterBottom align="center" color="primary">
                            Please provide the following:
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="password"
                                    name="password"
                                    type="password"
                                    label="New Password"
                                    fullWidth
                                    autoComplete="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                />
                            </Grid>
                            {(this.state.password === this.state.repassword) &&
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    id="repassword"
                                    name="repassword"
                                    type="password"
                                    label="Please re-enter your password."
                                    fullWidth
                                    autoComplete="password"
                                    onChange={this.handleChange}
                                    value={this.state.repassword}
                                />
                            </Grid>

                            }



                            { (this.state.password !== this.state.repassword)  &&
                            <Grid item xs={12}>
                                <TextField
                                    error
                                    id="repassword"
                                    name="repassword"
                                    type="password"
                                    label="Please re-enter your password."
                                    fullWidth
                                    autoComplete="password"
                                    onChange={this.handleChange}
                                    value={this.state.repassword}
                                />
                            </Grid>
                            }

                            {this.state.password === this.state.repassword ?
                            <Button
                                className={classes.button}
                                size="small"
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={false}
                                onClick={(event) => {this.handleSubmit(id)}}
                            >
                                Submit
                            </Button> :
                                <div></div>

                            }

                        </Grid>
                    </Paper>
                </main>
            </React.Fragment>
        )
    }
}
updatePW.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(updatePW);