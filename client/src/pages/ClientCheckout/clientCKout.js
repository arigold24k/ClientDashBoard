import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import OrderDetail from'./../../components/OrderDetail';
import PurposeSection from './../../components/PurposeSection';
import Review from './../../components/Review';
import Modal from '@material-ui/core/Modal';
// import Navbar from './../../components/Navbar';
import Navbar from '../../components/Navbar2';
import axios from 'axios';

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * -45,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'center',
    },
    paper1: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
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

const steps = ['Order Detail', 'Purpose', 'Review'];

class Checkout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            orderdetails : {partnum: '',
                quantity: '',
                tagnum: ''
            },
            purposedetails: {
                purpose: ''
            },
            open: false
        };
    }
    handleClose = () => {
        this.setState({ open: false });
    };

    handleOrderDetail = event => {
        const { name, value} = event.target;
        this.setState(prevState => ({
                                orderdetails: {
                                    ...prevState.orderdetails,
                                    [name]: value
                                }
        }));

    };
    handlePurposeChange = event => {
        const { name, value} = event.target;
        this.setState(prevState => ({
            purposedetails: {
                ...prevState.purposedetails,
                [name]: value
            }
        }));

    };
    handlepg0Reset = () => {
        this.setState({orderdetails:
                {partnum: '',
                quantity: '',
                tagnum: ''
            }});
    };
    handlepg1Reset = () => {
        this.setState({purposedetails:
                {purpose: '',
                barcode: ''
                }
        });
    };
    handleNext = () => {
        if((this.state.activeStep === 0 && (this.state.orderdetails.partnum !== '' && this.state.orderdetails.tagnum !== '' && this.state.orderdetails.quantity !== '')) || (this.state.activeStep === 1 && (this.state.purposedetails.purpose !== '' )) ) {
            this.setState(state => ({
                activeStep: state.activeStep + 1,
            }));
        }else {
            this.setState({open: true});
        }
        // this.setState(state => ({
        //     activeStep: state.activeStep + 1,
        // }));
        console.log("curent state: ", this.state);
    };

    handleSubmit = () => {
        const dataObj = {
            header: {
                authorization: "bearer " + sessionStorage.getItem("token")
            },
            body: {
                partnum: this.state.orderdetails.partnum,
                quantity: this.state.orderdetails.quantity,
                tagnum: this.state.orderdetails.tagnum,
                purpose: this.state.purposedetails.purpose
            }
        };
        axios.post("/api/processScan",dataObj).then((res, err) => {

        })
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
        console.log("curent state: ", this.state);
    };
    getStepContent = (step) => {
        switch (step) {
            case 0:
                return <OrderDetail updateval={this.handleOrderDetail.bind(this)} inputpart={this.state.orderdetails.partnum} inputqty={this.state.orderdetails.quantity} inputtagnum={this.state.orderdetails.tagnum}/>;
            case 1:
                return <PurposeSection updateval={this.handlePurposeChange.bind(this)} purposeval={this.state.purposedetails.purpose} barcodeVal={this.state.orderdetails.tagnum}/>;
            case 2:
                return <Review pnumber={this.state.orderdetails.partnum} tagnumber={this.state.orderdetails.tagnum} qty={this.state.orderdetails.quantity} purposeval={this.state.purposedetails.purpose}/>;
            default:
                throw new Error('Unknown step');
        }
    };
    getResetButton = (actstep, classes) => {
        switch(actstep) {
            case 0:
                return (<Button onClick={this.handlepg0Reset} className={classes.button} variant="outlined">
                            Reset
                        </Button>);
            case 1:
                return (<Button onClick={this.handlepg1Reset} className={classes.button} variant="outlined">
                            Reset
                         </Button>);
            default:
                return ('');
        }
    };
    render() {
        const { classes } = this.props;
        const { activeStep } = this.state;

        return (
            <React.Fragment>
                <CssBaseline />
                <Navbar handleSignOut={this.props.handleSignOut} username={this.props.username}/>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Order Input
                        </Typography>
                        <Stepper activeStep={activeStep} className={classes.stepper}>
                            {steps.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <React.Fragment>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography variant="h5" gutterBottom>
                                        Thank you for choosing PaceSetter.
                                    </Typography>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {this.getStepContent(activeStep)}
                                    <div className={classes.buttons}>
                                        {/*{this.getResetButton(activeStep, classes)}*/}
                                        {activeStep !== 0 && (
                                            <Button onClick={this.handleBack} className={classes.button}>
                                                Back
                                            </Button>
                                        )}
                                        {activeStep === steps.length - 1 ? <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleSubmit}
                                            className={classes.button}
                                        >
                                            Submit
                                        </Button> : <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleNext}
                                            className={classes.button}
                                        >
                                            Next
                                        </Button>}
                                        {this.getResetButton(activeStep, classes)}
                                    </div>
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    </Paper>
                </main>
                <div>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.paper1}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                Please make sure all fields are filled in.
                            </Typography>
                        </div>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}

Checkout.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Checkout);