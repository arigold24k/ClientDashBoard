import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
});

class ControlledOpenSelect extends React.Component {
    state = {
        purpose: '',
        open: false,
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    render() {
        const { classes } = this.props;

        return (
            <form autoComplete="off">
                <Button className={classes.button} onClick={this.handleOpen}>
                    Select the PURPOSE.
                </Button>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="purpose">Purpose</InputLabel>
                    <Select
                        open={this.state.open}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        value={this.state.purpose}
                        onChange={this.handleChange}                                
                        inputProps={{
                            name: 'purpose',
                            id: 'purp',
                        }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={1}>Receipt</MenuItem>
                        <MenuItem value={2}>Report</MenuItem>
                        <MenuItem value={3}>Consume</MenuItem>
                        <MenuItem value={4}>Error</MenuItem>
                        <MenuItem value={5}>Cycle Count</MenuItem>
                        <MenuItem value={6}>Production Receipt</MenuItem>
                    </Select>
                </FormControl>
            </form>
        );
    }
}

ControlledOpenSelect.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledOpenSelect);

