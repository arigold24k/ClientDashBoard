import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import NumberFormat from 'react-number-format';

const styles = theme => ({
    listItem: {
        padding: `${theme.spacing.unit}px 0`,
    },
    total: {
        fontWeight: '700',
    },
    title: {
        marginTop: theme.spacing.unit * 2,
    },
});


function purposetext(purp) {
    switch (purp) {
        case 1:
            return 'Receipt';
        case 2:
            return 'Report';
        case 3:
            return 'Consume';
        case 4:
            return 'Error';
        case 5:
            return 'Cycle Count';
        case 6:
            return 'Production Receipt';
        default:
            return '';
        // default:
        //     throw new Error('Unknown step');
    }
}

class Review extends React.Component {



    render(){
        const { classes } = this.props;
        const company = this.props.comp || "ABC Company";
        const part_number = this.props.pnumber || "GL1234";
        const tag_num = this.props.tagnumber || "TG7894";
        const quant = this.props.qty || 100;
        const purpose = purposetext(this.props.purposeval) || "Consume";


        return (
            <React.Fragment>
                <Typography variant="h6" gutterBottom>
                    Summary
                </Typography>
                <List disablePadding>
                    <ListItem className={classes.listItem} key={part_number}>
                        <ListItemText primary={`Part Number: ${part_number}`} secondary={`Tag Number: ${tag_num}`}/>
                        {/*<Typography variant="body2">{quant}</Typography>*/}
                        <Typography variant="body2"><NumberFormat value={quant} decimalScale={2} fixedDecimalScale={true} displayType={'text'} thousandSeparator={true} suffix={' Lb'}/></Typography>
                    </ListItem>
                </List>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom className={classes.title}>
                            {`Purpose: ${purpose}`}
                        </Typography>
                        <Typography gutterBottom> {company} </Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

Review.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Review);


{/*{products.map(product => (*/}
{/*))}*/}
{/*<ListItem className={classes.listItem}>*/}
{/*<ListItemText primary="Total" />*/}
{/*<Typography variant="subtitle1" className={classes.total}>*/}
{/*$34.06*/}
{/*</Typography>*/}
{/*</ListItem>*/}

{/*<Typography gutterBottom>{addresses.join(', ')}</Typography>*/}

{/*<Grid item container direction="column" xs={12} sm={6}>*/}
{/*<Typography variant="h6" gutterBottom className={classes.title}>*/}
{/*Payment details*/}
{/*</Typography>*/}
{/*<Grid container>*/}
{/*{payments.map(payment => (*/}
{/*<React.Fragment key={payment.name}>*/}
{/*<Grid item xs={6}>*/}
{/*<Typography gutterBottom>{payment.name}</Typography>*/}
{/*</Grid>*/}
{/*<Grid item xs={6}>*/}
{/*<Typography gutterBottom>{payment.detail}</Typography>*/}
{/*</Grid>*/}
{/*</React.Fragment>*/}
{/*))}*/}
{/*</Grid>*/}
{/*</Grid>*/}