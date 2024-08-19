const memberModel = require("./memberModel")
const memberRepository = require("./memberRepository")
delete require.cache[require.resolve('../subscriptions/subscriptionService')];
const subscriptionService = require("../subscriptions/subscriptionService")



const getAllMembers = async(search,pageIdx,limitPerPage)=>{
    try{
        const countMembers = await memberModel.countDocuments({})
        let members=[]
   
    if(!countMembers)
    {
        members = await memberRepository.getMembers()
        for (const member of members) {
            const newMember = new memberModel(member)
            await newMember.save()
        }
        members = await memberModel.find({}).limit(limitPerPage)
        return {members,isLastPage:false}
    }else{
        const lastPage = countMembers%limitPerPage? Math.floor(countMembers/limitPerPage)+1 : Math.floor(countMembers/limitPerPage)
        const isLastPage = lastPage===pageIdx+1? true : false
        const skip = pageIdx * limitPerPage;
        members = await memberModel.find({
        $or: [
            { name: { $regex: search, $options: "i" } }, 
            { email: { $regex: search, $options: "i" } }
        ]  
    })         
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitPerPage) 
        .lean() 
        members = await Promise.all(members.map(async (member) => {
            const movies = await subscriptionService.getMoviesByMember(member._id)
            return { ...member, movies }
        }))
        return {members,isLastPage}
    }
    
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
    return savedMember
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}
const updateMember = async(id, newData)=>{
    try{
    const updatedMember = await memberModel.findByIdAndUpdate(id, newData)
    return updatedMember
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}
const deleteMember = async(id)=>{
    try{
    await memberModel.findByIdAndDelete(id)
    await subscriptionService.deleteSubscribtion(id)
    return "Deleted"
} catch (error) {
    console.error("Error in member service:", error)
    throw new Error("Service unavailable")
}
}

module.exports = {getAllMembers,createMember,updateMember,deleteMember,getById}
