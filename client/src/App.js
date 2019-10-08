import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Login1 from "./pages/Login1";
import Checkout from './pages/ClientCheckout';
import Report from './pages/Reporting';
import Dashboard from './pages/DashBoard';
import axios from 'axios';
import './App.css';
import { withRouter } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import SignUP from './pages/SignUpPage';
import passwordRS from './components/PasswordReset';
import funcs_ from './functions/functions';
import update from './pages/updatePW';
require('es6-promise').polyfill();

const initialState = {open1: false,
    open3: false,
    redirectToRefererrer: false,
    open: false,
    open4: false,
    open5: false,
    auth: false
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    myCheckOutPage = () => {
        return (
            <Checkout handleSignOut={this.signOut.bind(this)} companyname={this.state.compName} />
        )
    };
    myReportingPage = () => {
        return (
            <Report handleSignOut={this.signOut.bind(this)} companyname={this.state.compName} />
        )
    };
    myDashboardPage = () => {
        return (
            <Dashboard handleSignOut={this.signOut.bind(this)} companyname={this.state.compName}/>
        )
    };
    signOut(){
        sessionStorage.removeItem('token');
        this.setState({auth: false});
        window.location.reload();
    };
    reload () {
        window.location.reload();
    }
    getKey (){
        const token = window.sessionStorage.getItem('token');
        // console.log('before it hits the api verify route ', token);
        // console.log("This is the path, ", window.location);
        if(token !== null) {
            axios.post('/api/verify', {token}).then((res, err) => {

                // console.log('This is the response from the getkey route ', res.data);
                // console.log('This is the type of for the res.data ', typeof res.data);
                // console.log('this is the data for res.data.data ', res.data.dataObj);

                // return res.data.data === true;
                if(res.data.dataObj.data === true){
                    this.setState({companyCode : res.data.dataObj.compCD, email: res.data.dataObj.email, auth: true, compName: res.data.dataObj.compName});
                    // console.log("state ", this.state);
                }else{
                    this.setState({auth:false})
                }
                if(this.props.location.pathname ==='/login1' && this.state.auth === true) {
                    this.props.history.push('/home_page');

                    //creating a timeout to reload page once the token has expired
                    // console.log('value being passed to the set time out ', (res.data.dataObj.expires - new Date().getTime() ));
                    // this.interval = setTimeout(this.reload, + res.data.dataObj.expires + new Date().getTime() );
                }
            });
        }else{
            this.setState({auth:false})
        }
    }
    componentWillMount(){
        // clearTimeout(this.interval);
        this.getKey();
        // console.log('This is the state in the component will mount ', this.state);
        // document.title = 'Client Dashboard';

      };
    componentDidMount() {
        // console.log("This is the state when the component moutned ", this.state);
        // window.location.href = '/login1';
    }
    getValue = (event) => {
        // Updates the input state
        const {name, value} = event.target;
        this.setState(
            {
                [name]: value
            }
        );
    };

    clearState = () => {
        this.setState(initialState)
    };

    handleClose = () => {
        this.setState({ open: false, open1: false });
        this.clearState();
        window.location.href = '/login1'
    };

    handlesubmit = (event) => {
        event.preventDefault();
        const pwHolder = this.state.password;
        if((typeof (this.state.usrname) === 'undefined' || (this.state.usrname == null)) && (typeof this.state.password === 'undefined' || this.state.password == null)) {
            this.setState({open3: true});
        }else {
            let dataObj ={...this.state};
            dataObj.password = funcs_.encryptPW(pwHolder);

        // console.log("created data object app.js page line 118 ", dataObj);

        axios.post('/login', dataObj).then((res, err) => {
            // console.log('this is the response for the login', res);
            // console.log('this is the response for the login', res.data);
            if(typeof (res.data.password) !== 'undefined' ){
                const check = funcs_.checkPW(this.state.password, res.data.password);
                this.setState({password: ''});
                const tokenObj = {
                    check: check,
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.Email,
                    comp: res.data.CompCode,
                    compname: res.data.comp_name
                };

                if (check) {
                    //creating token
                    axios.post('/verify/api', tokenObj).then((res, err) => {
                        // console.log("app. js handle submit verify request response, res: ", res);
                        if(typeof res.data.token !== 'undefined') {
                            //save this on local storage
                            sessionStorage.setItem('token', res.data.token);
                            this.setState({auth: true, email: res.data.email, compName: res.data.compName});
                            // console.log('this is the state after the auth was udpated ', this.state);
                            this.props.history.push('/home_page');
                        }else{
                            this.setState({open: true});
                        }
                    })
                }else {
                    this.setState({open: true});
                }
            }else {
                this.setState({open5: true});
            }
        }).catch((e) => {
            // console.log('Error: ', e);
        });}
    };
    handleAdd = (event) => {
        event.preventDefault();
        // console.log('this is the state of the log-in page', this.state);
        let dataObj ={...this.state};
        dataObj.password = funcs_.encryptPW(this.state.password);
        // console.log("this is the hashed password, ", dataObj.password);
        axios.post('/register', dataObj).then((res, err) => {
            // console.log('just wanted to see the error ', err);
            if(err){
                // console.log('There was an error ', err);
            }else{
                // res.status(200).json({message: 'this is the data' + res});
                if(res.data.data === 0) {
                    // console.log('Data was not Added.  User already exist ', res);
                    this.setState({open1: true});
                }
                else if(res.data.data === 3 ) {
                    // console.log('Data was not Added.  User already exist ', res);
                    this.setState({open1: true});
                }
                else {
                    // console.log('Data was added ', res);
                    this.setState({open4: true});
                }
            }
        }).catch((e) => {
            // console.log('Error: ', e);
        });
    };
    render() {

        return (
            <div>
                {/*{window.location ==+ '/' ? <Redirect from="/" exact to="/login1" /> : ''}*/}
                <Switch>
                    <Redirect exact from="/" to="/login1"/>
                    <Route exact path="/login1"><Login1 getValue={this.getValue.bind(this)}  usrname={this.state.usrname} open3={this.state.open3} open4={this.state.open4} open5={this.state.open5} handlesubmit={this.handlesubmit.bind(this)} handleAdd={this.handleAdd.bind(this)} open={this.state.open} open1={this.state.open1} handleClose={this.handleClose.bind(this)}/></Route>
                    <Route exact path="/signup" component={SignUP}/>
                    <Route exact path="/forgotdorwssap" component={passwordRS}/>
                    <Route exact path ='/updateinfo/:id' component={update}/>
                    <PrivateRoute exact path="/home_page" component={this.myDashboardPage} auth={this.state.auth}/>
                    <PrivateRoute exact path="/manage_inv" component={this.myCheckOutPage} auth={this.state.auth}/>
                    <PrivateRoute exact path="/reporting" component={this.myReportingPage} auth={this.state.auth}/>
                </Switch>
            </div>
    );
  }
}

export default withRouter(App);
