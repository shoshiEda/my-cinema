const mongoose = require("mongoose")


const memberSchema = new mongoose.Schema({
    name: String,
    email:String,
    city:String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("members", memberSchema)