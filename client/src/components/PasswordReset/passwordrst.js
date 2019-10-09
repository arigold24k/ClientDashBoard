import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import PropTypes from "prop-types";
import withStyles from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import Modal from '@material-ui/core/Modal';
//import Link from '@material-ui/core/Link';


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

const initial_State = {
    username: '',
    email: '',
    open1: false,
    open2: false,
    open3: false,
    open4: false,
    openerror: false
};

class passwordrst extends React.Component {

    constructor(props) {
        super(props);
        this.state = initial_State;
    }
    handleSubmit = () => {
        const dataObj = {
          username: this.state.username,
          email: this.state.email
        };
        if (this.state.username !== '' && this.state.email !== '') {
            axios.post('/passwordReset', dataObj).then((res) => {
                //value 1 is when the username does not exist
                // console.log("This is the reponse to the password reset, ", res.data);
                if(res.status === 200) {
                    if(res.data.data === 1) {
                        //username does not match
                        this.setState({open1: true})
                    }else if (res.data.data === 2) {
                        //email does not match
                        this.setState({open2: true})
                    }else if (res.data.data === 3) {
                        //error adding the data
                        this.setState({open3: true})
                    }
                    else if (res.data.data) {
                        //add code to send email to client
                        this.setState({id: res.data.data.data.id});
                        this.handleSendEmail(this.state.email, "Password Reset", `Please follow the link below to Reset Password. \n  ${window.location.origin}/updateinfo/${this.state.id}`);
                    }
                }
            }).catch((err) => {
                if(err) {
                    this.setState({open3: true})
                }
            })
        }else{
            this.setState({openerror: true})
        }
    };

    handleSendEmail = (v_to_email, v_subject, v_body) => {
        const dataObj = {
            SEND_TO: v_to_email,
            SUBJECT: v_subject,
            MESSAGE: v_body
        };

        axios.post('/sendEmail', dataObj).then((res) => {
            if (res.data.data && res.data.data !== 3) {
                this.setState({open4: true});
            }
        }).catch()
    };

    handleChange = (event) => {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        })
    };
    handlemodalClose = () => {
          this.setState(initial_State);
    };

    render () {
        const {classes} = this.props;
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
                            id="username"
                            name="username"
                            label="User Name"
                            fullWidth
                            autoComplete="username"
                            onChange={this.handleChange}
                            value={this.state.username}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="usnm"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            className={classes.button}
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </main>
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open1}
            onClose={() => {this.handlemodalClose()}}
        >
            <div style={getModalStyle()} className={classes.modal}>
                <Typography variant="h6" id="modal-title">
                    Error
                </Typography>
                <Typography variant="subtitle1" id="simple-modal-description">
                    {this.state.username} is not a valid username. Provide a valid Username.
                </Typography>
            </div>
        </Modal>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open2}
                onClose={() => {this.handlemodalClose()}}
            >
                <div style={getModalStyle()} className={classes.modal}>
                    <Typography variant="h6" id="modal-title">
                        Error
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        {this.state.email} is not a valid E-Mail. Provide a valid E-Mail.
                    </Typography>
                </div>
            </Modal>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open3}
                onClose={() => {this.handlemodalClose()}}
            >
                <div style={getModalStyle()} className={classes.modal}>
                    <Typography variant="h6" id="modal-title">
                        Error
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        There was an error processing your request.  Please try close the browser and retry.
                    </Typography>
                </div>
            </Modal>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open4}
                onClose={() => {this.handlemodalClose()}}
            >
                <div style={getModalStyle()} className={classes.modal}>
                    <Typography variant="h6" id="modal-title">
                        Click on Link below
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        An email has been sent to the email address on file with directions on how to reset your password.
                    </Typography>
                </div>
            </Modal>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.openerror}
                onClose={() => {this.handlemodalClose()}}
            >
                <div style={getModalStyle()} className={classes.modal}>
                    <Typography variant="h6" id="modal-title">
                        Error
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        Please make sure all fields are filled out.
                        {/*<Link href={`/updateinfo/${this.state.id}`} className={classes.link}>Click Here</Link>*/}
                    </Typography>
                </div>
            </Modal>
    </React.Fragment>
        )
    }
}
passwordrst.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(passwordrst);