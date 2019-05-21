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
import Button from "@material-ui/core/Button";

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
    button: {
        marginTop: theme.spacing.unit * -1,
        marginLeft: theme.spacing.unit,
        display: 'inline-flex',
        justifyContent: 'center',
        align: 'center',
    },
});

const initialState = {
    data: null,
    dataTable: null,
    columnToSort: "",
    sortDirection: "desc",
    filtered: false,
    selected: [],
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
            // return;
        }else {
            this.setState({selected: [], filter: false});
        }
    }
    getChartData = (conditions) => {
        const headerObj = {
            'Authorization': "bearer " + sessionStorage.getItem("token")
        };
        let holderArray = [];
        console.log('chart data is function is being hit');
        axios.post('/api/consumed', {email: this.state.email, filtered: conditions || false}, {headers: headerObj}).then((res) => {
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
                        tagcount: res.data.data[0][i].tagcount.toString(),
                        quantity: res.data.data[0][i].quantity.toString()
                    };
                    holderArrayTable.push(holderObjectTable);
                }
                this.setState({dataTable: holderArrayTable});
                holderArrayTable = [];
            }
        }).catch((err) => {
            console.log('error in getting the table data, ', err);
        })
    };
    handleSubmit = () => {
        let holdQueryString = "";
        const {selected} = this.state;
        if(selected.length > 0) {
            selected.map((x) => {
                if(selected.indexOf(x) === selected.length -1) {
                    holdQueryString = holdQueryString + "'" + x + "'";
                }else{
                    holdQueryString = holdQueryString + "'" + x + "', ";
                }
                return holdQueryString;
            });
            this.setState({
                filtered: holdQueryString
            });
            console.log("Data in teh handle submit in the dasboard page, ", holdQueryString);
            console.log("Data in teh handle submit in the dasboard page, ", this.state);

            this.getChartData(holdQueryString);
        }else{
            this.getChartData();
        }
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
                <div display='in-line'>
                <Typography variant="h4" gutterBottom component="h2">
                Product Flow {this.state.selected.length === 0 &&
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                    className={classes.button}
                    align='center'
                >
                    Reset
                </Button>
                }
                </Typography>
                </div>
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
                Products {this.state.selected.length > 0 &&
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                    className={classes.button}
                    align='center'
                >
                    Update Chart
                </Button>
                }
                </Typography>
                <div className={classes.tableContainer}>

                    {this.state.dataTable
                        ?

                            <SimpleTable
                                handleSelected={this.updSelected.bind(this)}
                                handleSelAll={this.handleSelectAll.bind(this)}
                                selected={this.state.selected}
                                dataPassed={this.state.dataTable}
                                incCheckBox={true}
                                tableTitle="Products"
                                columns={[
                                    {
                                        name: 'Product',
                                        id: 'name',
                                        numeric: false,
                                        disablePadding: true,
                                        label: "Product"
                                    },
                                    {
                                        name: 'Tag Count',
                                        id: 'tagcount',
                                        numeric: false,
                                        disablePadding: true,
                                        label: "Tag Count"
                                    },
                                    {
                                        name: 'Quantity in Inventory',
                                        id: 'quantity',
                                        numeric: true,
                                        disablePadding: true,
                                        label: 'Quantity in Inventory'
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