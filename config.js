/**
 * NODE JS SERVER SETTINGS AND CONFIGS
 */
module.exports =
{
	'port': process.env.PORT || 8080,   //server port
	'database': 'mongodb://vladmdev:2133352@jello.modulusmongo.net:27017/ymi3gimI', //mongo db server url
	'secret': 'cmsmeanapp',  //secret string for encrypting data
	'FACEBOOK_APP_ID': '225989431092512',     //Facebook app id for passport js facebook strategy
	'FACEBOOK_SECRET': '96062c31928f0390cbe22b0e9002a767'  //Facebook secret for passport js facebook strategy
};