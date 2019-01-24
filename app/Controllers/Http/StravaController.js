'use strict'

const strava = require('strava-v3');

const User = use('App/Models/User')
const Request = use('Request')

const Helpers = use('App/Helpers/')
const Trainalytics = use('App/Helpers/Trainalytics')

class StravaController {

	/* 
	* Index is the callback for Strava. We need to see here if there 
	* was a strava authorization. If not get this first. 
	*/
	async index ({view, request, auth, session, response}) {

		// Is user logged in?
		try {
			await auth.check()
		} catch (error) {
			return response.redirect('/login');
		}

		let tokens, user_token, token_is_valid, activities;
    	// user is logged in. get user	
        let user = await auth.getUser();

    	// is strava already authorized?
		if(user.strava_authorized){

			// get the tokens from the user
			tokens = user.getStravaTokens()	;

		} else {

			// oauth needs to finalize. get tokens
			tokens = await this.getStravaTokens(request);

			// set tokens for this user
			user.setStravaTokens(tokens);

		}

		// make sure token is still valid
		token_is_valid = Helpers.token_is_valid(tokens.expires_at);
    	
    	if(token_is_valid){

    		// to get athlete properties as stored @strava
			// let athlete = await this.getStravaAthlete(token);

			// get strava activities for this user
    		activities = await this.getStravaActivities(tokens);

    	} else {

    		console.log('old tokens', tokens);

    		// get a new access token with the refresh token
    		const new_tokens = await this.getNewStravaAccesToken(tokens);

			// set tokens for this user
			user.setStravaTokens(new_tokens);

			console.log('new access_token', new_tokens);

			//get activities with the new access token
			activities = await this.getStravaActivities(new_tokens);
    	}

    	// get all calculated data based on these activities
    	const chart_data = Trainalytics.getChartValues(activities);


		return view.render('index', { user: user.toJSON(), activities:chart_data })
		

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

	async getNewStravaAccesToken(tokens){

		return new Promise((resolve, reject) => {
		
			strava.oauth.getToken({'refresh_token':tokens.refresh_token, 'grant_type':'refresh_token'},function(err,payload,limits) {
			    	
				resolve(payload);

			});				

		});

	}	

	async getStravaActivities(payload){

		return new Promise((resolve, reject) => {
			
			strava.athlete.listActivities({'access_token':payload.access_token, per_page:30},function(err,payload,limits) {

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
