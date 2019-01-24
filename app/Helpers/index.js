'use strict'


/**
* Method to see if a timestamp is in the future
* @in unix time stamp f.e. 1548322227
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


module.exports = {
  token_is_valid
}