const express = require("express");
const app = express();
var body_parser = require('body-parser');
var db = require('./config/connection');
var collection = require("./config/collections")
const ObjectID = require("mongodb").ObjectID
const port = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");
let middleware = require("./middleware");
const { checkToken } = require("./middleware");
db.connect((err) => {
    if (err)
        console.log("mongo connection error " + err)
    else
        console.log("mongo connected")
});
app.use(express.json());
app.get('/view_byCat', middleware.checkToken, async function (req, res, next) {
    var result = [];
    let moviecat = await db.get().collection(collection.MOVIEDATA).aggregate([
        {
            $project: {
                genres: 1,
                _id: 0
            }
        },
        {
            $unwind: '$genres'
        },
    ]
    ).toArray()
    var uniquecat = await [...new Set(moviecat.map(item => item.genres))]
    for (let i = 0; i < uniquecat.length; i++) {
        result.push({
            genres: uniquecat[i], Movies: await db.get().collection(collection.MOVIEDATA).aggregate([
                {
                    $unwind: '$genres'
                },
                {
                    $match: { 'genres': uniquecat[i] }
                },
                {
                    $project: {
                        _id: 0,
                        director: 1,
                        imdb_rating: 1,
                        length: 1,
                        poster: 1,
                        title: 1
                    }
                },
            ])
                .toArray()
        })
    };
    res.json(result)
});
app.get('/view_movies', middleware.checkToken, async function (req, res, next) {

    res.json(await db.get().collection(collection.MOVIEDATA).find().toArray())
}
)
app.listen(port, "0.0.0.0", () =>
    console.log(`welcome your listernig at port ${port}`)
);// 0.0.0.0 for access through local host



