import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import classNames from 'classnames';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import orderBy from 'lodash/orderBy';
import TextField from '@material-ui/core/TextField';

class EnhancedTableHead extends React.Component {
    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, cols, incCheckBoxHead } = this.props;
        console.log("Enhanced header, Order: " + order + ". OrderBy: " + orderBy);
        console.log("Enhanced header, cols props " + cols[0].id);
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        {incCheckBoxHead ? <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                            color='primary'
                        /> : ''}

                    </TableCell>
                    {cols.map(
                        cols => (
                            <TableCell
                                key={cols.id}
                                align={cols.numeric ? 'right' : 'left'}
                                display='flex'
                                padding={cols.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === cols.id ? order : false}
                            >
                                <div display='block'>
                                    <Tooltip
                                        title="Sort"
                                        placement={cols.numeric ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === cols.id}
                                            direction={order}
                                            onClick={(event) => this.props.handleSort1(event, cols.id)}
                                        >
                                            {cols.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                </div>
                                <div display='block'>
                                    <TextField
                                        name={cols.id}
                                        hintText="Query"
                                        floatingLabelText="Query"
                                        value={this.props.query}
                                        onChange={(e) => this.props.handleQueryChange(e)}

                                    />
                                </div>
                            </TableCell>
                        ),
                        this,
                    )}
                </TableRow>
            </TableHead>
        );
    }
}
EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.primary.main,
                backgroundColor: lighten(theme.palette.primary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.primary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.primary,
    },
    title: {
        flex: '0 0 auto',
    },
});

let EnhancedTableToolbar = props => {
    const { numSelected, classes, title } = props;
    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        {title}
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        hover: 'primary'
    },
    table: {
        minWidth: 1020,
        backgroundColor: 'primary',
    },
    highlight: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.primary.dark
    },
    rowItem: {
        width: '90%'
    }
});
const initialState = {
    selected: [],
    page: 0,
    rowsPerPage: 5,
    columnToSort: '',
    sortDirection: 'desc',
    query: '',
    columnToQuery: '',

};
class EnhancedTable extends React.Component {
    state = initialState;
    constructor (props) {
        super(props);
        const {dataPassed} = this.props;
        //const {dataPassed, selected} = this.props;
        this.state = {
            ...initialState,
            rows: dataPassed,
            selected: []
        };
    };
    handleSort = (event, columnName) => {
        console.log("sort event object: ");
        console.log("Sort data is being hit Column Name:", columnName);
        this.setState({
            columnToSort: columnName,
            sortDirection: this.state.columnToSort === columnName ? (this.state.sortDirection === 'desc' ? 'asc' : 'desc') : 'asc'
        });
        console.log("State of the state after the update in the sort data function ", this.state);
    };

    handleQueryChange1 = (event) => {
        this.setState({
            columnToQuery: event.target.name,
            query: event.target.value
        })
    };

    componentDidMount () {
        console.log("Component Did Mount");
        const { dataPassed } = this.props;
        console.log(`component will moutn has this array being passed to it ${dataPassed}`);
        this.setState({
            rows: dataPassed
        })
    };

    handleSelectAllClick = event => {
        this.props.handleSelAll(event.target.checked, this.state.rows);
    };

    handleClick = (event, id) => {
        this.props.handleSelected(id);
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.props.selected.indexOf(id) !== -1;

    render() {
        const { classes, columns, tableTitle, selected, incCheckBox} = this.props;
        const rows = this.props.dataPassed;
        const { sortDirection, columnToSort, rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, (rows != null ? rows.length : 0) - page * rowsPerPage);
        const formQuery = this.state.query.toLowerCase();
        console.log("data being passed to table", this.state.columnToSort);
        console.log("data being passed to table, columns", columns);
        console.log("State in the table, ", this.state);

        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar numSelected={selected.length} title={tableTitle} />
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby={tableTitle}>
                        <EnhancedTableHead
                            incCheckBoxHead = {incCheckBox}
                            numSelected={selected.length}
                            order={sortDirection}
                            orderBy={columnToSort}
                            onSelectAllClick={this.handleSelectAllClick}
                            rowCount={rows.length}
                            cols={columns}
                            handleSort1={this.handleSort}
                            handleQueryChange={this.handleQueryChange1}
                        />
                        <TableBody>

                            {orderBy(this.state.query ? rows.filter(x => x[this.state.columnToQuery].toLowerCase().includes(formQuery)) : rows, this.state.columnToSort, this.state.sortDirection).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    onClick={event => this.handleClick(event, row.id)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    className={classes.rowItem}
                                    selected={this.isSelected(row.id)}
                                >
                                    <TableCell padding="checkbox">
                                        {incCheckBox ? <Checkbox color='primary' checked={this.isSelected(row.id)} /> : ''}
                                    </TableCell>
                                    {columns.map((col) => (
                                        <TableCell component="th" scope="row" align={col.numeric ? "right" : "left"}>
                                            {col.numeric ? row[col.id].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : row[col.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 48 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }
}

EnhancedTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);

// const actionsStyles = theme => ({
//     root: {
//         flexShrink: 0,
//         color: theme.palette.text.secondary,
//         marginLeft: theme.spacing.unit * 2.5,
//     },
// });
//
// class TablePaginationActions extends React.Component {
//     handleFirstPageButtonClick = event => {
//         this.props.onChangePage(event, 0);
//     };
//
//     handleBackButtonClick = event => {
//         this.props.onChangePage(event, this.props.page - 1);
//     };
//
//     handleNextButtonClick = event => {
//         this.props.onChangePage(event, this.props.page + 1);
//     };
//
//     handleLastPageButtonClick = event => {
//         this.props.onChangePage(
//             event,
//             Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
//         );
//     };
//
//     render() {
//         const { classes, count, page, rowsPerPage, theme } = this.props;
//
//         return (
//             <div className={classes.root}>
//                 <IconButton
//                     onClick={this.handleFirstPageButtonClick}
//                     disabled={page === 0}
//                     aria-label="First Page"
//                 >
//                     {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
//                 </IconButton>
//                 <IconButton
//                     onClick={this.handleBackButtonClick}
//                     disabled={page === 0}
//                     aria-label="Previous Page"
//                 >
//                     {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
//                 </IconButton>
//                 <IconButton
//                     onClick={this.handleNextButtonClick}
//                     disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                     aria-label="Next Page"
//                 >
//                     {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
//                 </IconButton>
//                 <IconButton
//                     onClick={this.handleLastPageButtonClick}
//                     disabled={page >= Math.ceil(count / rowsPerPage) - 1}
//                     aria-label="Last Page"
//                 >
//                     {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
//                 </IconButton>
//             </div>
//         );
//     }
// }
//
// TablePaginationActions.propTypes = {
//     classes: PropTypes.object.isRequired,
//     count: PropTypes.number.isRequired,
//     onChangePage: PropTypes.func.isRequired,
//     page: PropTypes.number.isRequired,
//     rowsPerPage: PropTypes.number.isRequired,
//     theme: PropTypes.object.isRequired,
// };
//
// const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
//     TablePaginationActions,
// );
//
// const styles = theme => ({
//     root: {
//         width: 'auto',
//         marginTop: theme.spacing.unit * 3,
//     },
//     table: {
//         minWidth: 500,
//     },
//     tableWrapper: {
//         overflowX: 'auto',
//     },
// });
//
// const initialState = {
//     rows: [],
//     page: 0,
//     rowsPerPage: 5,
// };
//
// class SimpleTable extends React.Component {
//     constructor (props) {
//         super(props);
//         const {dataPassed} = this.props;
//         this.state = {
//                 ...initialState,
//                 rows: dataPassed
//         };
//     }
//     componentDidMount () {
//         console.log("Component Did Mount");
//         const { dataPassed } = this.props;
//         console.log(`component will moutn has this array being passed to it ${dataPassed}`);
//         this.setState({
//             rows: dataPassed
//         })
//     }
//     handleChangePage = (event, page) => {
//         this.setState({ page });
//     };
//     handleChangeRowsPerPage = event => {
//         this.setState({ page: 0, rowsPerPage: event.target.value });
//     };
//     render() {
//         const { classes, columns, sortDirection, columnToSort } = this.props;
//         const rows = this.props.dataPassed;
//         const { rowsPerPage, page } = this.state;
//         const emptyRows = rowsPerPage - Math.min(rowsPerPage, (rows != null ? rows.length : 0) - page * rowsPerPage);
//         console.log("This is the props " + sortDirection + " " + columnToSort);
//         return (
//             <Paper className={classes.root}>
//                 <div className={classes.tableWrapper}>
//                     <Table className={classes.table}>
//                                      <TableHead>
//                                        <TableRow>
//                                            <TableCell padding="checkbox">
//                                                <Checkbox />
//                                            </TableCell>
//                                            {columns.map((col) => (
//                                                <TableCell align="left">
//                                                    <div onClick={() => this.props.handleSort(col.prop)}><span>{col.name} {columnToSort === col.prop ? (sortDirection === "asc" ? <UpArrow/> : <DownArrow/>) : null} </span></div>
//                                                </TableCell>
//                                            ))}
//                                         </TableRow>
//                                        </TableHead>
//                         <TableBody>
//                             {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
//                                 <TableRow key={row.id}>
//
//                                     {columns.map((col) => (
//                                         <TableCell component="th" scope="row" align="left">
//                                             {row[col.prop]}
//                                         </TableCell>
//                                     ))}
//                                 </TableRow>
//                             ))}
//                             {emptyRows > 0 && (
//                                 <TableRow style={{ height: 48 * emptyRows }}>
//                                     <TableCell colSpan={6} />
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                         <TableFooter>
//                             <TableRow>
//                                 <TablePagination
//                                     rowsPerPageOptions={[5, 10, 25]}
//                                     colSpan={3}
//                                     count={rows.length}
//                                     rowsPerPage={rowsPerPage}
//                                     page={page}
//                                     SelectProps={{
//                                         native: true,
//                                     }}
//                                     onChangePage={this.handleChangePage}
//                                     onChangeRowsPerPage={this.handleChangeRowsPerPage}
//                                     ActionsComponent={TablePaginationActionsWrapped}
//                                 />
//                             </TableRow>
//                         </TableFooter>
//                     </Table>
//                 </div>
//             </Paper>
//         );
//     }
// }
// SimpleTable.propTypes = {
//     classes: PropTypes.object.isRequired,
// };
//
// export default withStyles(styles)(SimpleTable);