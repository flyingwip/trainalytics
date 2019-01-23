'use strict'


 
const token_is_valid =  (token_time_tamp) => {
  
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