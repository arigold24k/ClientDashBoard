import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
});

function DatePickers(props) {
    const { classes } = props;

    return (
        <div>
        <form className={classes.container} noValidate>
            <TextField
                id="range1"
                label="From"
                type="date"
                value = {props.range1}
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={props.handleDateChange}
            />
        </form>
            <form className={classes.container} noValidate>
                <TextField
                    id="range2"
                    label="To"
                    type="date"
                    value= {props.range2}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={props.handleDateChange}
                />
            </form>
        </div>


    );
}

DatePickers.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);