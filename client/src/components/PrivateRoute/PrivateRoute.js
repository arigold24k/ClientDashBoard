import {Redirect, Route} from "react-router-dom";
import React from "react";


function PrivateRoute({ component: Component, auth, ...rest }) {

    console.log('this is what is being passed to private router constructor, ' + auth);

    return (
        <Route
            {...rest}
            render={props =>
                (auth)
                    ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login1",
                                state: { from: props.location }
                            }}
                        />
                    )
            }
        />
    );

}

export default PrivateRoute;