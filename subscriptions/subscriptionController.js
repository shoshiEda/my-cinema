const express = require("express")
const router = express.Router()
const subscriptionService = require("./subscriptionService")



router.post("/", async (req, res) => {
    try{
        const { memberId , movieId , movieDate } = req.body
        const status = await subscriptionService.addSubscription(memberId , movieId , movieDate)
        return res.json({ status })
} catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})



module.exports = router