'use strict'


/**
* Method to see if a timestamp is in the future
* @in unix time stamp f.e. 1548322227
* @return true/false 
*/ 
const token_is_valid = (token_time_tamp) => {
  
  // #get timestamp for now
  var now = Math.round(new Date().getTime() / 1000);

  if(token_time_tamp > now){
  	return true;	
  } else {
  	return false;
  }

}

/*
* Method to calculate if the token will expire within an hour
* @in amount of seconds
* @return true/false 
*/ 
const expire_within_hour = (expire_in) => {

	let temp = expire_in/3600;

	if(expire_in/3600<1){
		return true
	} else {
		return false;
	}

}


module.exports = {
  token_is_valid,
  token_is_valid
}