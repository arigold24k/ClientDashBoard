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
import Table from '../../components/SimpleTable';
import Icon from '@mdi/react';
import {mdiLoading} from "@mdi/js";
import axios from 'axios';
import DateBox from '../../components/DateSelector';
import Download from '../../components/ExcelExport';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'auto',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },
    chartContainer: {
        marginLeft: -22,
    },
    tableContainer: {
        height: 320,
    },
    h5: {
        marginBottom: theme.spacing.unit * 2,
    },
    paper1: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
        overflow: 'auto',
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * -1,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
        align: 'center',
    },
    loadSection: {
        align: 'center',
        marginTop: theme.spacing.unit * 3,
    },
        button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        display: 'inline-flex',
        justifyContent: 'center',
        align: 'center',
    },
    buttonHolder: {
        display: 'flex',
        flexWrap: 'wrap',
    }
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
            open2: false,
            data: null,
            range1: "",
            range2: "",
            columnToSort: "",
            sortDirection: "desc",
            selected: []
        };
    }
    handleClose = () => {
        this.setState({ modalOpen: false });
    };
    sortData = (columnName) => {
        console.log("Sort data is being hit Column Name:", columnName);
        this.setState({
            columnToSort: columnName,
            sortDirection: this.state.columnToSort === columnName ? (this.state.sortDirection === 'desc' ? 'asc' : 'desc') : 'asc'
        });
        console.log("State of the state after the update in the sort data function ", this.state);
    };

    handleClose2 = () => {
        this.setState({
            open2: false,
            range1: "",
            range2: ""
        })
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
        [prop] : value,
        range1: "",
        range2: ""
        })
    };
    handleDate = (event) => {
        console.log("the event target object beign passed to the handledate, ", event.target.value);
        const { value, id} = event.target;
        if(id === 'range2') {
            if(this.state.range1 > value) {
                this.setState({open2: true});
            }
        }
        this.setState({
            [id] : value
        });
        console.log("state once date is changed", this.state);
    };

    handleSubmit = () => {
        const headerObj = {
            'Authorization': "bearer " + sessionStorage.getItem("token")
        };
        this.setState({runReport: true, data: null});
        let dataObj;
        if (this.state.period === 5){
            dataObj = {comp: this.props.companyname, period: this.state.period, range1: this.state.range1, range2: this.state.range2};
        }else {
            dataObj  = {comp: this.props.companyname, period: this.state.period};
        }

        let holderArray = [];
            axios.post('/reporting', dataObj, {headers: headerObj}).then((res, err) => {
                if(err) {
                    console.log('Error in getting data from database for reporting ', err);
                }
                console.log('this is the response from the reporting 1', res.data.data[0]);
                if(res.data.data[0] !== null && res.data.data[0].length > 0) {
                    for (let i = 0; i < res.data.data[0].length; i++) {
                        let holderDate = res.data.data[0][i].SCANDATE + '';
                        let holderArr =  holderDate.split('T');
                        console.log("Splitting the date, ", holderArr);
                        let dObj = {
                            'id' : res.data.data[0][i].RECNO,
                            'recno': res.data.data[0][i].RECNO.toString(),
                            'scandate': holderArr[0],
                            'scancode': res.data.data[0][i].CODE,
                            'product': res.data.data[0][i].PART,
                            'quantity': res.data.data[0][i].QTY.toString(),
                            'tagnum': res.data.data[0][i].TAG_NUM,
                        };

                        holderArray.push(dObj);
                    }
                    this.setState({data: holderArray});
                    holderArray = [];
                }else {
                    this.setState({data: []
                    });
                }

                console.log('this is the state after the submit, ', this.state);
            })

    };

    updSelected (newSel) {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(newSel);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, newSel);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({
            selected: newSelected
        });
        console.log("update selected on dasboard being hit, ", this.state);
    }

    handleSelectAll (checked, rows) {
        if (checked) {
            this.setState({ selected: rows.map(n => n.id) });
            return;
        }
        this.setState({ selected: [] });
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
            <div className={classes.root}>
                <CssBaseline/>
                < Navbar handleSignOut={this.props.handleSignOut} username={this.props.companyname}/>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h4" align="center">
                            Reporting
                        </Typography>
                        <React.Fragment>
                            <TextField
                                select
                                className={classNames(classes.margin, classes.textField)}
                                variant="outlined"
                                label="Time Range"
                                align='center'
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

                            {this.state.period === 5 &&

                                <DateBox handleDateChange={this.handleDate.bind(this)} range1={this.state.range1} range2={this.state.range2}/>




                            }

                            {((this.state.period !== "" && this.state.period !== 5) || (this.state.period === 5 && this.state.range1 !=="" && this.state.range2 !== "")) &&
                            <div className={classes.buttonHolder}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSubmit}
                                    className={classes.button}
                                    align='center'
                                >
                                    Run Report
                                </Button>

                                {this.state.runReport && (this.state.data !== null && <Download dataArray={this.state.data}/>) }
                            </div>
                            }



                            <CssBaseline/>

                            <div>
                                {this.state.runReport &&
                                (this.state.data !== null ?
                                        <Table
                                            dataPassed={this.state.data}
                                            tableTitle={"Report"}
                                            handleSelected={this.updSelected.bind(this)}
                                            handleSelAll={this.handleSelectAll.bind(this)}
                                            selected={this.state.selected}
                                            incCheckBox={false}

                                            columns={[
                                                {
                                                    name: 'Rec Number',
                                                    id: 'recno',
                                                    numeric: false,
                                                    disablePadding: true,
                                                    label: 'Rec Number'
                                                },
                                                {
                                                    name: 'Scan Date',
                                                    id: 'scandate',
                                                    numeric: false,
                                                    disablePadding: true,
                                                    label: 'Scan Date'
                                                },
                                                {
                                                    name: 'Scan Code',
                                                    id: 'scancode',
                                                    numeric: false,
                                                    disablePadding: true,
                                                    label: 'Scan Code'
                                                },
                                                {
                                                    name: 'Product',
                                                    id: 'product',
                                                    numeric: false,
                                                    disablePadding: true,
                                                    label: 'Product Number'
                                                },
                                                {
                                                    name: 'Quantity',
                                                    id: 'quantity',
                                                    numeric: true,
                                                    disablePadding: true,
                                                    label: 'Quantity in Inventory'
                                                },
                                                {
                                                    name: 'Tag Number',
                                                    id: 'tagnum',
                                                    numeric: true,
                                                    disablePadding: true,
                                                    label: 'Tag Number'
                                                }
                                            ]}
                                        />
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
                                )
                                }
                            </div>
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
                <div>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.state.open2}
                        onClose={this.handleClose2}
                    >
                        <div style={getModalStyle()} className={classes.paper1}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                Invalid Date Range.
                            </Typography>
                        </div>
                    </Modal>
                </div>
            </div>
            </React.Fragment>
        );
    }
}

report.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(report);