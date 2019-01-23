'use strict'

const strava = require('strava-v3');

const User = use('App/Models/User')
const Request = use('Request')

const Helpers = use('App/Helpers/')

class StravaController {

	/* 
	* Index is the callback for Strava. We need to see here if there 
	* was a strava authorization. If not get this first. 
	*/
	async index ({view, request, auth, session, response}) {

		try {
			await auth.check()
		} catch (error) {
			return response.redirect('/login');
		}

		
		// Is user logged in
        let user = await auth.getUser();

		

        if (user) {

        	

        	let tokens;
        	let user_token ;
        	let token_is_valid;
        	let activities;
        	// is strava already authorized?
			if(user.strava_authorized){

				console.log('strava_authorized');

				// if not get the tokens from the user
				tokens = user.getStravaTokens()	;

				

			} else {

				console.log('fresh token');

				// oauth needs to finalize. get tokens
				tokens = await this.getStravaTokens(request);

				// set tokens for this user
				user.setStravaTokens(tokens);

			}

			console.log(tokens);        	

			// make sure token is still valid
			token_is_valid = Helpers.token_is_valid(tokens.expires_at);
        	
        	console.log('token_is_valid = ' + token_is_valid);
        	
        	if(token_is_valid){

        		// get strava activities for this user
				// let athlete = await this.getStravaAthlete(token);

        		activities = await this.getStravaActivities(tokens);

        		return view.render('index', { user: user.toJSON(), activities:activities })

        	} 

			// user is not logged in
			return view.render('index', { user: user.toJSON()})
		}
	  	
	  	
	  	response.redirect('/login');

	}

	async connect ({ request, auth, session, response }) {

		let url = strava.oauth.getRequestAccessURL({scope:"activity:read"}) ;
		
		response.redirect(url)		
	}

	async getStravaTokens(request){

		return new Promise((resolve, reject) => {
		
			strava.oauth.getToken(request.get().code,function(err,payload,limits) {
			    	
				resolve(payload);

			});				

		});

	}

	async getStravaActivities(payload){

		console.log('token = ' + payload.access_token);

		return new Promise((resolve, reject) => {
			
			strava.athlete.listActivities({'access_token':payload.access_token, per_page:10},function(err,payload,limits) {

				resolve(payload);				

			});

		});		

	}  	


	async getStravaAthlete(payload){

		return new Promise((resolve, reject) => {
			
			strava.athlete.get({'access_token':payload.access_token},function(err,payload,limits) {

				resolve(payload);				

			});

		});		

	}  


}

module.exports = StravaController
