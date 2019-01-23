'use strict'

const strava = require('strava-v3');

const User = use('App/Models/User')
const Request = use('Request')

class StravaController {


	async index ({view, request, auth, session, response}) {

		// Is user logged in
        let user = await auth.getUser();
        
		if (user) {

			let token = await this.getStravaTokens(request);

			// set the tokens to the user
			user.strava_authorized = 1;
			user.strava_token_expires_at = token.expires_at;
			user.strava_token_expires_in = token.expires_in;
			user.strava_token_access_token = token.access_token;
			user.strava_token_refresh_token = token.refresh_token;
			
			// do we need to wait? 
			//await user.save();
			user.save();
				
			// get strava activities for this user
			// let athlete = await this.getStravaAthlete(token);
			const activities = await this.getStravaActivities(token);

			console.log(activities);

			return view.render('index', { user: user.toJSON(), activities:activities })
		}
	  	
	  	
	  	response.redirect('/logout');

	}

	async connect ({ request, auth, session, response }) {

		session.put('user_email', auth.user.email);

		console.log( session.get('user_email') )

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
