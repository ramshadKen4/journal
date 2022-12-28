var mongoClient = require('mongodb').MongoClient;

var state = {
    db: null
}

module.exports.connect = function(done) {
    url = "mongodb://127.0.0.1:27017"
    mongoClient.connect(url, (err, data) => {
        if (err) done(err)
        state.db = data.db("journal")
        done("db connected")
    })
}

module.exports.get = function(){
    return state.db;
}