const express = require('express');
const app = express();
const port = 8000;
require("./config/database")


const cors = require("cors")


app.use(express.json()) 
app.use(cors())


const movieController = require("./movies/movieController")
app.use("/movies", movieController)

const memberController = require("./members/memberController")
app.use("/members", memberController)

const subscriptionController = require("./subscriptions/subscriptionController")
app.use("/subscriptions", subscriptionController)


app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});