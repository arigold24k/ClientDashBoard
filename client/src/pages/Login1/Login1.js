import React from "react";
import SignIn from '../../components/SignIn';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    modal: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    }
});

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

class Login1 extends React.Component {
    render(props) {
        const{classes} = this.props;
        return (
            <React.Fragment>
                <SignIn handleinput={this.props.getValue}  handlesubmit={this.props.handlesubmit} handleadd={this.props.handleAdd}/>

                <div>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.props.open1}
                        onClose={this.props.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.modal}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                User Already Exist.
                            </Typography>
                        </div>
                    </Modal>
                    <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.props.open}
                    onClose={this.props.handleClose}
                >
                    <div style={getModalStyle()} className={classes.modal}>
                        <Typography variant="h6" id="modal-title">
                            Error
                        </Typography>
                        <Typography variant="subtitle1" id="simple-modal-description">
                            Username or Password is incorrect.
                        </Typography>
                    </div>
                </Modal>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.props.open3}
                        onClose={this.props.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.modal}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                Please provide a Username and Password.
                            </Typography>
                        </div>
                    </Modal>

                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.props.open4}
                        onClose={this.props.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.modal}>
                            <Typography variant="h6" id="modal-title">
                                User Added
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                User {this.props.usrname} has been added.
                            </Typography>
                        </div>
                    </Modal>
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={this.props.open5}
                        onClose={this.props.handleClose}
                    >
                        <div style={getModalStyle()} className={classes.modal}>
                            <Typography variant="h6" id="modal-title">
                                Error
                            </Typography>
                            <Typography variant="subtitle1" id="simple-modal-description">
                                NO User Exist.
                            </Typography>
                        </div>
                    </Modal>
                </div>

            </React.Fragment>
        )
    }
}

export default withStyles(styles)(Login1);

