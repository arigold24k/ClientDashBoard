import React, {useState}  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import {withRouter} from "react-router-dom";

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    button2: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginLeft: 'auto',
    },
    appBar: {
        position: 'static',
    },
    links: {
        textDecoration: 'none',
        color: 'black'
    }
};

class navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEL: null,
        };
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    pushReporting = () => {
        this.props.history.push('/reporting');
    };

    pushInvManag = () => {
        this.props.history.push('/manage_inv');
    };

    pushHome = () => {
        this.props.history.push('/home_page');
    };

    handleClose = (event) => {
       // event.preventDefault();
        this.setState({ anchorEl: null });
    };
    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div className={classes.root}>
                <AppBar position="static" color="default" className={classes.appBar}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" aria-owns={open ? 'fade-menu' : undefined} aria-haspopup="true" onClick={this.handleClick}>
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="fade-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}
                            TransitionComponent={Fade}
                        >

                            <MenuItem onClick={this.pushHome}>Home</MenuItem>
                            <MenuItem onClick={this.pushInvManag}>Process Material</MenuItem>
                            <MenuItem onClick={this.handleClick}><span onClick={this.pushReporting}> Reporting </span></MenuItem>
                            <MenuItem onClick={this.props.handleSignOut}><span >Logout</span></MenuItem>
                        </Menu>

                        <Typography variant="h6" color="inherit" noWrap>
                            PaceSetter Steel
                        </Typography>

                        <Button
                            color="primary"
                            onClick={this.props.handleSignOut}
                            className={classes.button2}
                        >
                            Sign Out
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

navbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(navbar));
