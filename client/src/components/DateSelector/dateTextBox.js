import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import classNames from 'classnames';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit * .5,
        marginRight: theme.spacing.unit,
        width: 200,
        marginTop: theme.spacing.unit * 3,
    },
});

function DatePickers(props) {
    const { classes } = props;

    return (
        <form className={classes.container} noValidate>
            <TextField
                className={classes.textField}
                id="range1"
                label="From"
                type="date"
                variant="outlined"
                color="primary"
                value={props.range1}
                onChange={props.handleDateChange}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    startAdornment: <InputAdornment position="start">Time</InputAdornment>,
                }}
            />
            <TextField
                id="range2"
                label="To"
                type="date"
                variant="outlined"
                color="primary"
                value={props.range2}
                onChange={props.handleDateChange}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </form>
    );
}

DatePickers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);