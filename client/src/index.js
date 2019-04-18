import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, MuiThemeProvider}  from "@material-ui/core/styles";



const theme = createMuiTheme({
    palette: {
        primary: {500 : "#86af49"},
        action: {
            active: "#b5e7a0",
            hover: "#618685"
        }
    }
});

ReactDOM.render((
    <Router>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Router>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
