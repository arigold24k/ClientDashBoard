import React from "react";
import AppBar from "material-ui/AppBar";
import Logo from "./../Logo";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const header = () => (
    <MuiThemeProvider>
    <AppBar
        title ={<Logo/>}
    />
    </MuiThemeProvider>
);


export default header;