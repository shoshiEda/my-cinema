const mongoose = require("mongoose")


const movieSchema = new mongoose.Schema({
    name: String,
    premiered: Date,
    genres:[String],
    img:String,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("movies", movieSchema)