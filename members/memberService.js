const memberModel = require("./memberModel")
const memberRepository = require("./memberRepository")
const subscriptionService = require("../subscriptions/subscriptionService")


const getAllMembers = async()=>{
    try{
    let members = await memberModel.find({})
    if(!members.length)
    {
        members = await memberRepository.getMembers()
        for (const member of members) {
            const newMember = new memberModel(member)
            await newMember.save()
        }
        members = await memberModel.find({}); 
    }else{
        members = await Promise.all(members.map(async (member) => {
            const movies = await subscriptionService.getMoviesByMember(member._id)
            return { ...member.toObject(), movies }
        }))
    }
    return members
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}


const getById = async(id)=>{
    try{
    const member = await memberModel.findById(id)
    return member?  member :  {}
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}
const createMember = async(newMember)=>{
    try{
    const savedMember = new memberModel(newMember)
    await savedMember.save()
    return "saved"
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}
const updateMember = async(id, newData)=>{
    try{
    await memberModel.findByIdAndUpdate(id, newData)
    return "Updated"
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}
const deleteMember = async(id)=>{
    try{
    await memberModel.findByIdAndDelete(id)
    return "Deleted"
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}

module.exports = {getAllMembers,createMember,updateMember,deleteMember,getById}
