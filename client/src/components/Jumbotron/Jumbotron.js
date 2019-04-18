import React from "react";

export const Jumbotron = ({children}) => (
    <div style={{height: 300, clear: 'both'}} className="jumbotron">
        {children}
    </div>
);