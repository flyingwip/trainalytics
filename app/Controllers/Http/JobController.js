'use strict'

const Job = use('App/Models/Job')

class JobController {


    async home({view, response,  request,  auth}) {

    	// Is user logged in
        const user = await auth.getUser();
        
		if (user) {

			return view.render('index', { user: user.toJSON() })
		}
	  	
	  	
	  	response.redirect('/logout');
	  	
	}

}

module.exports = JobController