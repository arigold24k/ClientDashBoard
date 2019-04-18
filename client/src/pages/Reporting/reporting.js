import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Navbar from './../../components/Navbar2';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * -42,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
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

    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        display: 'flex',
        justifyContent: 'center',
    },
    formControl1: {
        margin: theme.spacing.unit,
        minWidth: 120,
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        flexBasis: 200,
        margin: theme.spacing.unit,
    },
});

const ranges = [{
    value: 1,
    label: 'Today'
    },{
    value: 2,
    label: 'Current Week'
    },{
    value: 3,
    label: 'MTD'
    },{
    value: 4,
    label: 'YTD'
    },{
    value: 5,
    label: 'Custom'
    }];

const ranges1 = [{
    value: 1,
    label: 'Receipt'
},{
    value: 2,
    label: 'Report'
},{
    value: 3,
    label: 'Consumed'
},{
    value: 4,
    label: 'Error'
},{
    value: 5,
    label: 'Cycle Count'
},{
    value: 6,
    label: 'Production Receipt'
}];

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

class report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            period : "",
            purpose: "",
            open: false,
            modalOpen: false

        };
    }
    handleClose = () => {
        this.setState({ open: false });
    };

    openModal = () => {
        this.setState({open: true})
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleChange = prop => event => {
        const { value } = event.target;
        this.setState({
        [prop] : value
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <CssBaseline />
                <Navbar handleSignOut={this.props.handleSignOut} username={this.props.username}/>
                <main className={classes.layout}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Reporting
                        </Typography>
                        <React.Fragment>
                            {/*<form autoComplete="off">*/}
                                {/*<FormControl className={classes.formControl1}>*/}

                                    <TextField
                                    select
                                    className={classNames(classes.margin, classes.textField)}
                                    variant="outlined"
                                    label="Time Range"
                                    value={this.state.period}
                                    onChange={this.handleChange('period')}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">Time</InputAdornment>,
                                    }}
                                >
                                    {ranges.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                    </TextField>


                                    <TextField
                                        select
                                        className={classNames(classes.margin, classes.textField)}
                                        variant="outlined"
                                        label="Transaction type"
                                        value={this.state.purpose}
                                        onChange={this.handleChange('purpose')}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">Purpose</InputAdornment>,
                                        }}
                                    >
                                        {ranges1.map(option => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                            {/*</FormControl>*/}
                            {/*</form>*/}

                                {(this.state.period != "" && this.state.purpose != "") && <Button
                                    variant="contained"
                                    color="primary"
                                    // onClick={}
                                    className={classes.button}
                                > Run Report </Button>
                                }


                        </React.Fragment>
                    </Paper>
                </main>
                <div>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.paper1}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                One of the fields was left unfilled.
                            </Typography>
                        </div>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}

report.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(report);