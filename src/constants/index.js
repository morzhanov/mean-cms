/**
 * NODE JS SERVER SETTINGS AND CONFIGS
 */
module.exports =
    {
        'port': process.env.PORT || 8080,   //server port
        'database': 'mongodb://vlad_morzhanov:rMk2133352#@generalcluster-shard-00-00-cu9lx.mongodb.net:27017,generalcluster-shard-00-01-cu9lx.mongodb.net:27017,generalcluster-shard-00-02-cu9lx.mongodb.net:27017/admin?replicaSet=GeneralCluster-shard-0&ssl=true&authSource=admin',
        'secret': 'cmsmeanapp',  //secret string for encrypting data
        'FACEBOOK_APP_ID': '225989431092512',     //Facebook app id for passport js facebook strategy
        'FACEBOOK_SECRET': '96062c31928f0390cbe22b0e9002a767'  //Facebook secret for passport js facebook strategy
    };
