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
import Modal from "@material-ui/core/Modal";
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

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

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
            repassword: '',
            open: false,
            open1: false
    };

    handleSubmit = (event, id) => {
        if ((this.state.password === this.state.repassword) && this.state.password !== '') {
            const encrypPW = functions.encryptPW(this.state.password);
            const dataObj = {
                id,
                pw: encrypPW,
            };
            axios.post('/updateDrowssap', dataObj).then((res) => {
                if (res.data === 'SUCCESS') {
                    this.setState({open: true});
                }
                // console.log("Area where the data is coming back from updating password")
            }).catch((err) => {
                if(err) {
                    this.setState({open1: true});
                }
            });
            return false;
        }
    };
    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        })
    };
    handleClose = () => {
        this.setState({open: false});
        window.location.href = '/#/login1'
    };

    handleClose1 = () => {
        this.setState({open1: false})
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

                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open}
                        onClose={this.handleClose()}
                    >
                        <div style={getModalStyle()} className={classes.paper1}>
                            <Typography variant="h6" id="modal-title">
                                Success
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                Password has successfully been updated.
                            </Typography>
                            <Button onClick={this.handleClose()} className={classes.button}>
                            Close
                        </Button>
                        </div>
                    </Modal>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open1}
                        onClose={this.handleClose1}
                    >
                        <div style={getModalStyle()} className={classes.paper1}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                Password Was not updated.
                            </Typography>
                            <Button onClick={this.handleClose1()}>
                                Close
                            </Button>
                        </div>
                    </Modal>


                </main>
            </React.Fragment>
        )
    }
}
updatePW.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(updatePW);