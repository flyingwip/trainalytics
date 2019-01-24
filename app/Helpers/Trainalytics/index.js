'use strict'

var _ = require('lodash');
var step = require('everpolate').step

//-------------- helper functions 

function round(item) {
  return Math.round(item);
}

function belowLimit(item){
	return item < 200;
}

function aboveLimit(item){
	return item >= 200;
}

function filterWattworks(filter){
	return function doFilter(item){
		return item.name.indexOf(filter)>-1;	
	}	
}

function formatToDutchDate(dateString){

	let date = new Date(dateString);
	var monthNames = [
	    "jan", "feb", "mar",
	    "apr", "mei", "jun", "jul",
	    "aug", "sep", "okt",
	    "nov", "dec"
	  ];

	var day = date.getDate();
  	var monthIndex = date.getMonth();
  	var year = date.getFullYear();

  	return day + ' ' + monthNames[monthIndex] + ' ' + year ;
  	

}

function formatToUnixTimestamp(dateString){

	let date = new Date(dateString);

  	return Math.round((date).getTime() / 1000);

} 

function fileWritten(data){

	return data;
}


function getChartValues(activities){

    let wattworks_activities = _.filter(activities, filterWattworks('Technogym'));
    let speedworks_activities = _.filter(wattworks_activities, filterWattworks('SpeedWorks'));
    let climbworks_activities = _.filter(wattworks_activities, filterWattworks('ClimbWorks'));
    let blockworks_activities = _.filter(wattworks_activities, filterWattworks('BlockWorks'));
    let powerworks_activities = _.filter(wattworks_activities, filterWattworks('PowerWorks'));


	let arr_average_watts  = _.map(wattworks_activities, 'average_watts'); 
	arr_average_watts = _.map(arr_average_watts, Math.round);
	
	let training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToDutchDate);	

	let average = Math.round(_.meanBy(wattworks_activities, (p) => p.average_watts));
	let average_sp_works = Math.round(_.meanBy(speedworks_activities, (p) => p.average_watts));
	let average_cl_works = Math.round(_.meanBy(climbworks_activities, (p) => p.average_watts));
	let average_bl_works = Math.round(_.meanBy(blockworks_activities, (p) => p.average_watts));
	let average_pw_works = Math.round(_.meanBy(powerworks_activities, (p) => p.average_watts));

	//let max = Math.max(arr_average_watts);
	let max = Math.max.apply(Math, arr_average_watts);
	let min = Math.min.apply(Math, arr_average_watts);

	// 
	let below_limit = _.filter(arr_average_watts, belowLimit).length;
	let above_limit = _.filter(arr_average_watts, aboveLimit).length;

	let unix_training_dates  = _.map(_.map(wattworks_activities, 'start_date'), formatToUnixTimestamp);

	// step(x {Array|Number}, X {Array}, Y {Array}) → {Array}
	let next = step(1, unix_training_dates, arr_average_watts);

	let body_weight = 82;
	let pw_body_weight = Math.round(average/body_weight);

	let last = wattworks_activities.slice(Math.max(wattworks_activities.length - 5, 1));

	let average_last_works = Math.round(_.meanBy(last, (p) => p.average_watts));	

	return {
		results: arr_average_watts,
		amount_training_sessions : wattworks_activities.length, 
		dates: training_dates,
		average:average,
		max : max,
		min : min,
		below_limit: below_limit,
		above_limit, above_limit,
		next : next,
		average_sp_works: average_sp_works,
		average_pw_works: average_pw_works,
		average_bl_works : average_bl_works,
		average_cl_works : average_cl_works,
		pw_body_weight : pw_body_weight,
		average_last_works : average_last_works
	};



} 

exports.round = round
exports.belowLimit = belowLimit
exports.aboveLimit = aboveLimit
exports.filterWattworks = filterWattworks
exports.formatToDutchDate = formatToDutchDate
exports.formatToUnixTimestamp = formatToUnixTimestamp
exports.getChartValues = getChartValues


// --------------------------------------


// module.exports = {
//   token_is_valid
// }