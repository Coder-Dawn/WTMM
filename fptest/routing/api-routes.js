// ===============================================================================
// LOAD DATA
// linking our routes to a series of "data" sources. 
// These data sources hold arrays of information on all possible friends
// ===============================================================================

var fs = require('fs'); 
var mentors 		= require('../data/fptest.js');





// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app){

	// API GET Requests
	// Below code handles when users "visit" a page. 
	// In each of the below cases when a user visits a link 
	// (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table) 
	// ---------------------------------------------------------------------------

	app.get('/api/mentors', function(req, res){
		res.json(mentors);
	});


	// API POST Requests
	// Below code handles when a user submits a form and thus submits data to the server.
	// In each of the below cases, when a user submits form data (a JSON object)
	// ...the JSON is pushed to the appropriate Javascript array
	// ---------------------------------------------------------------------------

	app.post('/api/mentors', function(req, res){

		// Our "server" will respond to a user's survey result
		// Then compare those results against every user in the database.
		// It will then calculate the difference between each of the numbers and the user's numbers.
		// It will then choose the user with the least differences as the "best friend match."
		// In the case of multiple users with the same result it will choose the first match.
		// After the test, it will push the user to the database. 

		// We will use this object to hold the "best match". We will constantly update it as we 
		// loop through all of the options 
		var bestMatch = {
			name: "",
			photo: "",
			mentorDifference: 1000
		};

		// Here we take the result of the user's survey POST and parse it.
		var userData 	= req.body;
		var userName 	= userData.name;
		var userPhoto 	= userData.photo;
		var userScores 	= userData.scores;

		// This variable will calculate the difference between the user's scores and the scores of
		// each user in the database
		var totalDifference = 0;

		// Here we loop through all the mentor possibilities in the database. 
		for  (var i=0; i< mentors.length; i++) {

			//console.log(mentors[i].name);
			totalDifference = 0;

			// We then loop through all the scores of each mentor
			for (var j=0; j< mentors[i].scores[j]; j++){

				// We calculate the difference between the scores and sum them into the totalDifference
				totalDifference += Math.abs(parseInt(userScores[j]) - parseInt(mentors[i].scores[j]));
				console.log(totalDifference);
				// If the sum of differences is less then the differences of the current "best match"
				if (totalDifference <= bestMatch.mentorDifference){
					console.log(bestMatch);
					// Reset the bestMatch to be the new mentor. 
					bestMatch.name = mentors[i].name;
					bestMatch.photo = mentors[i].photo;
					bestMatch.mentorDifference = totalDifference;
				}
			}
		}

		// Finally save the user's data to the database (this has to happen AFTER the check. otherwise,
		// the database will always return that the user is the user's best friend).
		mentors.push(userData);

		// Return a JSON with the user's bestMatch. This will be used by the HTML in the next page. 
		res.json(bestMatch);

	});

	app.post('/newUser', function(req, res){
		var newUserDetails = req.body;

		//use fs.write node module to write new users onto the fptest.js

		fs.writeFile("fptest.js",function(err) {
    
	// If the code experiences any errors it will log the error to the console. 
    if(err) {
        return console.log(err);
    }

    // Otherwise, it will print: "user database was updated!"
    console.log("user database was updated!");
}); 




	});

	app.post('/login', function(req, res){
		var userLoginInfo = req.body;
		var currentUser;

		for (var i = 0; i < mentors.length; i++) {
			if (mentors[i].name == userLoginInfo.name && mentors[i].password == userLoginInfo.password) {
				currentUser = mentors[i];
			}
		}
		res.send(currentUser);

	});

	app.post('/surveyTaken', function(req, res){
		var surveyResults = req.body.results;
		var user = req.body.user;

		//fs.write the info below to the fptest.js file
		var currentUser = getCurrentUser(user);
		mentors[currentUser.index].scores = surveyResults;


	});

	function getCurrentUser(sentUser){
		mentors.forEach(function(user, index){
			if (user.name == sentUser.name) {
				user.index = index;
				return user;
			}
		});
	}
}