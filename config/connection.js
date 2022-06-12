const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = function (done) {
    const url = 'mongodb+srv://sibin:sibin@cluster0.0chkm.mongodb.net/?retryWrites=true&w=majority'
    const dbname = 'Movie'
    mongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true }, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}
module.exports.get = function () {
    return state.db
}
