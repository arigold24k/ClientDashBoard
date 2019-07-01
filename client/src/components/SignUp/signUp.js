import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class signUp extends React.Component {

    render () {
        return <React.Fragment>
            <Typography variant="h6" gutterBottom align="center" color="primary">
                Create account
             </Typography>
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="companyCode"
                        name="companyCode"
                        label="Company Code"
                        fullWidth
                        autoComplete="companyCode"
                        onChange={this.props.updateval}
                        value={this.props.CC}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        id="userName"
                        name="userName"
                        label="User Name"
                        fullWidth
                        autoComplete="usnm"
                        onChange={this.props.updateval}
                        value={this.props.UN}
                    />
                </Grid>


                { this.props.email1 == '' ?
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            name="email"
                            label="Email"
                            fullWidth
                            autoComplete="email"
                            onChange={this.props.updateval}
                            value={this.props.email1}
                        />
                    </Grid> :
                    (

                    (this.props.validE) ?
                    <Grid item xs={12}>
                    <TextField
                    required
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    autoComplete="email"
                    onChange={this.props.updateval}
                    value={this.props.email1}
                    />
                    </Grid>
                :
                    <Grid item xs={12}>
                    <TextField
                    error
                    id="email"
                    name="email"
                    label="Email"
                    fullWidth
                    autoComplete="email"
                    onChange={this.props.updateval}
                    value={this.props.email1}
                    />
                    </Grid>

                    )}



                <Grid item xs={12}>
                    <TextField
                        required
                        id="password"
                        name="password"
                        label="Password"
                        fullWidth
                        type="password"
                        autoComplete="current-password"
                        onChange={this.props.updateval}
                        value={this.props.PW}
                    />
                </Grid>
                <Grid item xs={12}>
                    {this.props.PW === this.props.REPW ?
                        ( <TextField
                            required
                            id="rePassWord"
                            name="rePassWord"
                            label="Re-Enter Password"
                            fullWidth
                            type="password"
                            autoComplete="current-password"
                            onChange={this.props.updateval}
                            value={this.props.REPW}
                        />) : (
                            <TextField
                                error
                                id="rePassWord"
                                name="rePassWord"
                                label="Re-Enter PassWord"
                                fullWidth
                                type="password"
                                autoComplete="current-password"
                                onChange={this.props.updateval}
                                value={this.props.REPW}
                            />
                        )
                    }
                </Grid>
            </Grid>
        </React.Fragment>
    }

}

export default signUp;