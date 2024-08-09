const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
    name: String,
    premiered: Date,
    genres:[String],
    img:String

})

module.exports = mongoose.model("movies", movieSchema)