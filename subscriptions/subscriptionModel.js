const mongoose = require("mongoose")


const subscriptionSchema = new mongoose.Schema({
    memberId: String,
    movies:[{movieId: String,date: [Date]}],
   
})

module.exports = mongoose.model("subscriptions", subscriptionSchema)