import React from "react";
import Modal from '@material-ui/core/Modal';
import withStyles from '@material-ui/core/styles/withStyles';
import SignUp from '../../components/SignUp';
import PropTypes from "prop-types";
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import funcs_ from "../../functions/functions";
require('es6-promise').polyfill();

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

function checkEmail(email) {
    let emailRGEX = /[\w.]+@\w+\.(net|com|edu|gov)/;

    return emailRGEX.test(email);
}

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

class signuppage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyCode: '',
            userName: '',
            email: '',
            password: '',
            rePassWord: '',
            open1: false,
            open: false,
            open2: false,
            open3: false,
            validEM: true,
        };
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let dataObj ={...this.state};
        dataObj.password = funcs_.encryptPW(this.state.password);
        //let v_Email = this.state.validEM;

        if (checkEmail(this.state.email)) {
            axios.post('/register', dataObj).then((req, res) => {
                // console.log("This is the response to the front end from the register api ", req);
                if(req.data.data === true) {
                    this.setState({open1: true});
                }else if (req.data.data === 3) {
                    this.setState({open2: true});
                }else if (req.data.data === 0) {
                    this.setState({open: true});
                }
            });
        }else {
            this.setState({open3: true})
        }


    };
    handleClose = (event) => {
      this.setState({open: false, open2: false});
        window.location.reload();
    };
    handleClose1 = (event) => {
        this.setState({open1: false});
        window.location.href = '/#/login1'
    };

    handleClose3 = (event) => {
        this.setState({open3: false, email: ''});
        // window.location.reload();
    };
    handleChange = (event) => {
        const {name , value} = event.target;
        this.setState({
            [name] : value
        })
    };
    render () {
        const { classes } = this.props;

        return (
            <React.Fragment>
            <CssBaseline />
            <main className={classes.layout}>
            <Paper className={classes.paper}>
            <SignUp updateval={this.handleChange.bind(this)} CC={this.state.companyCode} UN={this.state.userName} PW={this.state.password} REPW={this.state.rePassWord} email1={this.state.email} validE={checkEmail(this.state.email)}/>
            <div>
                {((this.state.password === this.state.rePassWord) && (this.state.password !== '' && this.state.companyCode !== '' && this.state.userName !== '' && this.state.email !== '')) ? (
                <Button
                    className={classes.button}
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                >
                    Sign Up!
                </Button>
                ): (
                    <Typography component="h6" variant="h6" align="center">
                        Already have an account? Click here to <Link href={'/#/login1'} className={classes.link}>Sign-In</Link>
                    </Typography>
                )
                }
            </div>
            </Paper>
            </main>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open1}
                    onClose={this.handleClose1}
                >
                    <div style={getModalStyle()} className={classes.modal}>
                        <Typography variant="h6" id="modal-title">
                            User Added
                        </Typography>
                        <Typography variant="subtitle1" id="simple-modal-description">
                            User {this.state.userName} has been added.
                        </Typography>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.modal}>
                        <Typography variant="h6" id="modal-title">
                            User already exist for the current User Code
                        </Typography>

                    </div>
                </Modal>

                <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open2}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.modal}>
                    <Typography variant="h6" id="modal-title">
                        No Company Code exist.
                    </Typography>

                </div>
            </Modal>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open3}
                    onClose={this.handleClose3}
                >
                    <div style={getModalStyle()} className={classes.modal}>
                        <Typography variant="h6" id="modal-title">
                            Please Provide a valid email address.
                        </Typography>

                    </div>
                </Modal>

        </React.Fragment>
        )
    }
}
signuppage.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(signuppage);