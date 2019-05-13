import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import SimpleLineChart from '../../components/SimpleLineChart';
import SimpleTable from '../../components/SimpleTable';
import Navbar from '../../components/Navbar2';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiLoading } from '@mdi/js';
import Paper from '@material-ui/core/Paper';
import orderBy from 'lodash/orderBy';

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
        marginLeft: theme.spacing.unit * 5,
    },
    h5: {
        marginBottom: theme.spacing.unit * 2,
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
        overflow: 'auto',
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
        align: 'center',
    },
    loadSection: {
        align: 'center',
    },
});

const initialState = {
    data: null,
    dataTable: null,
    columnToSort: "",
    sortDirection: "desc",
    filtered: false,
};

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };

    componentWillMount() {
        if(this.state.dataTable === null) {
            this.getChartData();
            this.getTableData();
        }
    }



    getChartData = () => {
        const headerObj = {
            'Authorization': "bearer " + sessionStorage.getItem("token")
        };
        let holderArray = [];
        console.log('chart data is function is being hit');
        axios.post('/api/consumed', {email: this.state.email, filtered: this.state.filtered}, {headers: headerObj}).then((res) => {
            let holderObject = {};
            if(res.data.data !== null) {
                console.log('Data that is coming back from the consumption, ', res.data.data[0]);
                //have the array built here
                holderArray = [];
                for (let i = 0; i < res.data.data[0].length; i++) {
                    holderObject = {
                        name: res.data.data[0][i].Month,
                        Consumed: res.data.data[0][i].Consumed,
                        Received: res.data.data[0][i].Received
                    };
                    // holderArray = this.state.data;
                    holderArray.push(holderObject);
                }
                this.setState({data: holderArray});
                holderArray = [];
            }

            console.log('Holder Array for the data, ', this.state.data);
        }).catch((err) => {
            console.log('Error: ', err);
        });

    };
    sortData = (columnName) => {
        console.log("Sort data is being hit Column Name:", columnName);
        this.setState({
            columnToSort: columnName,
            sortDirection: this.state.columnToSort === columnName ? (this.state.sortDirection === 'desc' ? 'asc' : 'desc') : 'asc'
        });
        console.log("State of the state after the update in the sort data function ", this.state);
    };

    getTableData = () => {
        const headerObj = {
            'Authorization': "bearer " + sessionStorage.getItem("token")
        };
        let holderArrayTable = [];
        axios.post('/api/consumedTable', this.state.email, {headers: headerObj}).then((res) => {
            let holderObjectTable = {};
            if(res.data.data !== null) {
                console.log('Data that is coming back from the consumption, ', res.data.data[0]);
                //have the array built here
                holderArrayTable = [];
                for (let i = 0; i < res.data.data[0].length; i++) {
                    holderObjectTable = {
                        id: res.data.data[0][i].PART,
                        name: res.data.data[0][i].PART,
                        quantity: parseInt(res.data.data[0][i].quantity)
                    };
                    // holderArray = this.state.data;
                    holderArrayTable.push(holderObjectTable);
                }
                this.setState({dataTable: holderArrayTable});
                holderArrayTable = [];
            }
        }).catch((err) => {
            console.log('error in getting the table data, ', err);
        })
    };

    render() {
        console.log('Holder Array for the data,1 ', this.state.data);

        const { classes } = this.props;
        console.log('data being passed to the line chart befroe the return, ', this.state.data);
        console.log('data being passed to the order by', orderBy(this.state.dataTable, this.state.columnToSort, this.state.sortDirection));
        return (

                <div className={classes.root}>
                <CssBaseline/>
                < Navbar handleSignOut={this.props.handleSignOut} username={this.props.companyname}/>
                <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Typography variant="h4" gutterBottom component="h2">
                Product Flow
                </Typography>
                <Typography component="div" className={classes.chartContainer}>

                    {this.state.data
                            ?
                                <SimpleLineChart passData={this.state.data}/>
                            :
                                <Paper className={classes.paper}>
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
                    }

                </Typography>
                <Typography variant="h4" gutterBottom component="h2">
                Products
                </Typography>
                <div className={classes.tableContainer}>

                    {this.state.dataTable
                        ?

                            <SimpleTable
                                dataPassed={orderBy(this.state.dataTable, this.state.columnToSort, this.state.sortDirection)}
                                handleSort={this.sortData.bind(this)}
                                sortDirection = {this.state.sortDirection}
                                columnToSort={this.state.columnToSort}
                                columns={[
                                    {
                                        name: 'Product',
                                        prop: 'name'
                                    },
                                    {
                                        name: 'Quantity in Inventory',
                                        prop: 'quantity'
                                    }
                                ]}
                            />
                        :
                        <Paper className={classes.paper}>
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
                    }
                </div>
                </main>
                </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);