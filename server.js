var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Express configuration//

var app = express();
var PORT = process.env.PORT || 8080;


// / BodyParser makes it easy for our server to interpret data sent to it.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(express.static('./fptest/public'))

// ROUTER
require('./fptest/routing/api-routes.js')(app); 
require('./fptest/routing/html-routes.js')(app);

// LISTENER
// The below code effectively "starts" our server 
app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});

