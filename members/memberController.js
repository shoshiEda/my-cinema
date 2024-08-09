const express = require("express")
const router = express.Router()
const memberService = require("./memberService.js")

router.get("/", async (req, res) => {
    try{
    const members = await memberService.getAllMembers()
    return res.json(members)
} catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.get("/:id", async (req, res) => {
    try{
    const id = req.params.id 
    const member = await memberService.getById(id)
    return res.json(member)
} catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})



router.post("/", async (req, res) => {
    try{
        const { name , email , city = "" } = req.body
        const newMember = {name,email,city}
        const status = await memberService.createMember(newMember)
        return res.json({ status })
} catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.put("/:id", async (req, res) => {
    try{
    const id = req.params.id
    const newData = req.body
    const status = await memberService.updateMember(id, newData)
    return res.json({ status })
} catch (error) {
    console.error("Error editind member:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.delete("/:id", async (req, res) => {
    try{
    const id = req.params.id
    const status = await memberService.deleteMember(id)
    return res.json({ status })
} catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})

module.exports = router