import React from "react";
import button from '@material-ui/core/Button';
import {grey500} from 'material-ui/styles/colors';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';;


const style = {
    backgroundColor: grey500,
    labelColor: grey500
};

const Button = (props) => (
    <div className='btn'>
            <button label={props.name} onCick={props.handleClick} style={style}/>
    </div>

);

export default Button;