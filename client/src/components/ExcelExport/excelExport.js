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
        const { classes, dataArray } = this.props;
        const data = [];
        const multiDataSet = [];
        let keyHolder = [];
        let dataHolder = [];

        const columnsArray = [
            {title: "Rec Number", width: {wch: 12}, background: "FF00FF00",
                // style: {
                //     fill: {patternType: "solid", bgColor: {rgb: "FF00FF00"}},
                //     font:{sz: "14", bold: true},
                //     alignment: {vertical: "center", horizontal: "center"},
                //     border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}},
                //     numFmt: "0"
                //
                // }
            },
            {title: "Scan Date", width: {wch: 12},
                style: {
                    fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}},
                    font:{sz: "14", bold: true},
                    alignment: {vertical: "center", horizontal: "center"},
                    border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}},
                    numFmt: "yyyy-mm-dd"

                }
            },
            {title: "Scan Code", width: {wch: 12},
                style: {
                    fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}},
                    font:{sz: "14", bold: true},
                    alignment: {vertical: "center", horizontal: "center"},
                    border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}}

                }
            },
            {title: "Product", width: {wch: 12},
                style: {
                    fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}},
                    font:{sz: "14", bold: true},
                    alignment: {vertical: "center", horizontal: "center"},
                    border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}}

                }
            },
            {title: "Quantity", width: {wch: 12},
                style: {
                    fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}},
                    font:{sz: "14", bold: true},
                    alignment: {vertical: "center", horizontal: "center"},
                    border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}},
                    numFmt: "#,##0"

                }
            },
            {title: "Tag Number", width: {wch: 12},
                style: {
                    fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}},
                    font:{sz: "14", bold: true},
                    alignment: {vertical: "center", horizontal: "center"},
                    border: {bottom: {style: "thick", color: { rgb: "FFFFAA00" }}},
                    numFmt: "#,##0"

                }
            }
        ];

        multiDataSet.push({ySteps: 1, columns: columnsArray});


        //have to loop through data being passed and create an array of objects

        //looping through array being passed so array[0] will give us first object
        for (let i = 0; i < dataArray.length; i++) {
            dataHolder = [];
            keyHolder = [];
            //putting all the keys of the object into an array
            keyHolder = Object.keys(dataArray[i]);
                for (let j = 1; j < keyHolder.length; j++) {
                    if( j === 5 ) {
                        dataHolder.push({value: dataArray[i][keyHolder[j]], style: {font: {sz: "12"}, numFmt: "#,##0", alignment: {vertical: "center", horizontal: "center"}}});
                    }else {
                        dataHolder.push({value: dataArray[i][keyHolder[j]], style: {font: {sz: "12"}, alignment: {vertical: "center", horizontal: "center"}}});
                    }

                }
            data.push(dataHolder);

        }



        multiDataSet[0].data = data;

        console.log("This is the object being created: ", multiDataSet);
        console.log("This is the original object passed as param: ", dataArray);

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
            } filename={"Report Request"}>
                {/*<ExcelSheet data={dataArray} name="Scanned_Report">*/}
                {/*    <ExcelColumn label="Rec Number" value="recno" />*/}
                {/*    <ExcelColumn label="Scan Date" value="scandate"/>*/}
                {/*    <ExcelColumn label="Scan Code" value="scancode"/>*/}
                {/*    <ExcelColumn label="Product" value="product"/>*/}
                {/*    <ExcelColumn label="Quantity" value="quantity"/>*/}
                {/*    <ExcelColumn label="Tag Number" value="tagnum"/>*/}
                {/*    /!*<ExcelColumn label="Marital Status"*!/*/}
                {/*                 /!*value={(col) => col.is_married ? "Married" : "Single"}/>*!/*/}
                {/*</ExcelSheet>*/}
                <ExcelSheet dataSet={multiDataSet} name="Scanned_Report" />
            </ExcelFile>
        );
    }
}

export default withStyles(styles)(Download);

