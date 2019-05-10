import React from "react";
import ReactExport from "react-data-export";
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit,
        display: 'inline-flex',
        justifyContent: 'center',
        align: 'center',
    }

});


class Download extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <ExcelFile element={
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    align='center'
                >
                    Download Report
                </Button>
            }>
                <ExcelSheet data={this.props.dataArray} name="Export">
                    <ExcelColumn label="Rec Number" value="recno"/>
                    <ExcelColumn label="Scan Date" value="scandate"/>
                    <ExcelColumn label="Scan Code" value="scancode"/>
                    <ExcelColumn label="Product" value="product"/>
                    <ExcelColumn label="Quantity" value="quantity"/>
                    <ExcelColumn label="Tag Number" value="tagnum"/>
                    {/*<ExcelColumn label="Marital Status"*/}
                                 {/*value={(col) => col.is_married ? "Married" : "Single"}/>*/}
                </ExcelSheet>
            </ExcelFile>
        );
    }
}

export default withStyles(styles)(Download);

