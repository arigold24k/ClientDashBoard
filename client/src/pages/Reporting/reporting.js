import React from "react";
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
import Table from '../../components/Table';
import Icon from "../DashBoard/dashboard";
import {mdiLoading} from "@mdi/js";
import axios from 'axios';

const styles = theme => ({
    layout: {
        width: '95%',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * -27,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        width: '95%',
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

// const ranges1 = [{
//     value: 1,
//     label: 'Receipt'
// },{
//     value: 2,
//     label: 'Report'
// },{
//     value: 3,
//     label: 'Consumed'
// },{
//     value: 4,
//     label: 'Error'
// },{
//     value: 5,
//     label: 'Cycle Count'
// },{
//     value: 6,
//     label: 'Production Receipt'
// }];

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
            runReport: false,
            open: false,
            modalOpen: false,
            data: null

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

    handleSubmit = () => {
        const headerObj = {
            'Authorization': "bearer " + sessionStorage.getItem("token")
        };
        this.setState({runReport: true, data: null});
        let dataObj = {comp: this.props.companyname, period: this.state.period};
        let holderArray = [];
            axios.post('/reporting', dataObj, {headers: headerObj}).then((res, err) => {
                if(err) {
                    console.log('Error in getting data from database for reporting ', err);
                }
                console.log('this is the response from the reporting 1', res.data.data[0].length);
                if(res.data.data[0] !== null && res.data.data[0].length > 0) {
                    for (let i = 0; i < res.data.data[0].length; i++) {
                        let dObj = {
                            'recno': res.data.data[0][i].RECNO,
                            'scandate': res.data.data[0][i].SCANDATE,
                            'product': res.data.data[0][i].PART,
                            'quantity': res.data.data[0][i].QTY,
                            'tagnum': res.data.data[0][i].TAG_NUM,
                        };

                        holderArray.push(dObj);
                    }
                    this.setState({data: holderArray});
                    holderArray = [];
                }else {
                    this.state.data = [];
                }

                console.log('this is the state after the submit, ', this.state);
            })

    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <CssBaseline />
                <Navbar handleSignOut={this.props.handleSignOut} username={this.props.companyname}/>
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

                                {(this.state.period !== "" ) && <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    className={classes.button}
                                > Run Report </Button>
                                }




                        </React.Fragment>
                    </Paper>
                    <div>
                        {this.state.runReport &&
                        (this.state.data ?
                                <Table dataPassed={this.state.data}/>
                                :
                                <Paper>

                                    <Typography variant="h4" gutterBottom component="h2" className={classes.loadSection} align="center">
                                        <Icon path={mdiLoading}
                                              size={1.5}
                                              horizontal
                                              vertical
                                              rotate={90}
                                              color="#86af49"
                                              spin/>
                                    </Typography>
                                    <Typography variant="h4" gutterBottom component="h2" className={classes.loadSection} align="center">
                                        Loading...
                                    </Typography>

                                </Paper>
                        )}

                    </div>
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