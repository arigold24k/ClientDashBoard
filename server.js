const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const app = express();
const methodOverride = require('method-override');
const routes = require('./routes/handle');
const db = require("./models");
// const db = require('./config/connection');
let http = require('http').Server(app);


//need to include my routes here
//const apiRoutes = require("./routes/articles");

// Serve up static assets
// app.use(express.static("public"));

// if (process.env.NODE_ENV === 'production') {
//     // Serve any static files
//     app.use(express.static(path.join(__dirname, 'client/build')));
//     // Handle React routing, return all requests to React app
//     app.get('*', function(req, res) {
//         res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//     });
// }

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
// app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use("/",routes);
// Send every request to the React app
// Define any API routes before this runs

// db.authenticate().then(() => {console.log("Database connected")
//
// }).catch((err) => {
//     console.log("Error ", err)
// });

db.sequelize.sync({ force: false })

    .then(function() {
        http.listen(PORT, function() {
            console.log('http listening on *:', PORT);
        });
    });

// app.listen(PORT, function() {
//     console.log(`🌎 ==> Server now on port ${PORT}!`);
// });
