import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';


class orderDetail extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.inputpart === '' && this.props.inputqty === '' && this.props.inputtagnum === '') {
            // this.myRef.focus();
            this.focusUsernameInputField(this.myRef);
        }
    }
    focusUsernameInputField = (input) => {
        if (input) {
           input.focus()
        }
    };
    render () {
    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Order Details - Scanned Material Count {this.props.count}
            </Typography>
            <Grid container spacing={24}>
                {/*<Grid item xs={12} sm={6}>*/}
                <Grid item xs={12}>
                    <TextField
                        required
                        inputRef={(input) => {this.myRef = input}}
                        id="partnum"
                        name="partnum"
                        label="Part Number"
                        fullWidth
                        autoComplete="pnum"
                        onChange={this.props.updateval}
                        value={this.props.inputpart}
                        autoFocus={true}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="quantity"
                        name="quantity"
                        label="Quantity"
                        fullWidth
                        autoComplete="qty"
                        onChange={this.props.updateval}
                        value={this.props.inputqty}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="tagnum"
                        name="tagnum"
                        label="Tag Number"
                        fullWidth
                        autoComplete="tgnum"
                        onChange={this.props.updateval}
                        value={this.props.inputtagnum}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );}
}
export default orderDetail;