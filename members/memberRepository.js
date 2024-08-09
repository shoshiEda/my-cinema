const axios = require("axios")

const URL = 'https://jsonplaceholder.typicode.com/users';

const getMembers = async() => {
    const {data : members} = await axios.get(URL)
    return members.map(member => ({name:member.name,email:member.email,city:member.address.city}))
}

module.exports = {getMembers}