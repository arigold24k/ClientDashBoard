import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const styles = theme => ({
    button: {
        display: 'block',
        marginTop: theme.spacing.unit * 2,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    barcode: {
        align: 'center',
    },
});

class PurposeForm extends React.Component {
    state = {
        open: false,
    };

    // handleChange = event => {
    //     this.setState({ [event.target.name]: event.target.value });
    //     console.log(this.state);
    // };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    generateBarCode = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    render()
    {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Purpose
                </Typography>
                <Grid container spacing={24} justify={'center'}>
                    <Grid item xs>
                        <form autoComplete="off">
                            {/*<Button className={classes.button} onClick={this.handleOpen}>*/}
                                {/*Select the PURPOSE.*/}
                            {/*</Button>*/}
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="purpose">Purpose</InputLabel>
                                <Select
                                    open={this.state.open}
                                    onClose={this.handleClose}
                                    onOpen={this.handleOpen}
                                    value={this.props.purposeval}
                                    onChange={this.props.updateval}
                                    inputProps={{
                                        name: 'purpose',
                                        id: 'purp',
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Receipt</MenuItem>
                                    <MenuItem value={2}>Consume</MenuItem>
                                    <MenuItem value={3}>Error</MenuItem>
                                    <MenuItem value={4}>Cycle Count</MenuItem>
                                    <MenuItem value={5}>Production Receipt</MenuItem>
                                </Select>
                            </FormControl>
                        </form>
                    </Grid>
                    {/*{this.props.purposeval === '' ?*/}
                        {/*(<Grid item xs>*/}
                        {/*</Grid>) : (*/}
                            {/*<Grid item xs className={classes.barcode}>*/}
                                {/*<Barcode*/}
                                    {/*value = {purposetext(this.props.purposeval).substring(0,3) + this.props.barcodeVal}*/}
                                    {/*// width = {2}*/}
                                    {/*height = {100}*/}
                                    {/*format = {"CODE128"}*/}
                                    {/*displayValue = {true}*/}
                                    {/*fontOptions = {""}*/}
                                    {/*font = {"monospace"}*/}
                                    {/*textAlign = {"center"}*/}
                                    {/*textPosition = {"bottom"}*/}
                                    {/*textMargin = {2}*/}
                                    {/*fontSize = {20}*/}
                                    {/*background = {"#ffffff"}*/}
                                    {/*lineColor = {"#000000"}*/}
                                    {/*margin = {10}*/}
                                    {/*marginTop = {undefined}*/}
                                    {/*marginBottom = {undefined}*/}
                                    {/*marginLeft = {undefined}*/}
                                    {/*marginRight = {undefined}*/}
                                {/*/>*/}
                            {/*</Grid>*/}
                        {/*)}*/}
                    <Grid item xs={12}>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}
PurposeForm.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PurposeForm);
