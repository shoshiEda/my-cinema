const subscriptionModel = require("./subscriptionModel")
const movieService = require("../movies/movieService")
const memberService = require("../members/memberService")



const addSubscription = async(memberId,movieId)=>{
    try {
        const subscription = await subscriptionModel.findOne({ memberId })
        const currentDate = new Date()
        if (subscription) {
            const movieIndex = subscription.movies.findIndex(movie => movie.movieId === movieId)
            if (movieIndex !== -1) {
                subscription.movies[movieIndex].date.push(currentDate)
            } else {
                subscription.movies.push({ movieId, date: [currentDate] })
            }

            await subscription.save();
            return "Subscription updated";
        } else {
            const newSubscription = new subscriptionModel({
                memberId,
                movies: [{ movieId, date: currentDate }]
            });

            await newSubscription.save();
            return "New subscription created";
        }
} catch (error) {
    console.error("Error in subscription service:", error)
    throw new Error("Service unavailable")
}
}

const getMoviesByMember = async(memberId)=>{
    try {
        const subscription = await subscriptionModel.findOne({ memberId })
        if (subscription) {
            
            const fullMoviesData = await Promise.all(subscription.movies.map(async(movie) => 
                {
                    const fullMovieData = await movieService.getMovieById(movie.movieId)
                    return {...fullMovieData,dates:[...movie.date]}
                } ))
            return fullMoviesData
        } else return []
        }
 catch (error) {
    console.error("Error in subscription service:", error)
    throw new Error("Service unavailable")
}
}

getMoviesByMember('66b4dced7e07f527acc9debc')

const findMembersByMovieId = async (movieId) => {
    try {
        const subscriptions = await subscriptionModel.find({ 
            "movies.movieId": movieId 
        })
        if(!subscriptions.length) return []
        const members = await Promise.all(subscriptions.map(async (subscription) => 
            {
            const member = await memberService.getById(subscription.memberId)
            const dates = subscription.movies
                .filter(movie => movie.movieId.toString() === movieId.toString())
                .map(movie => movie.date);

            return { ...member.toObject(), dates }
        }))   
        return members
    } catch (error) {
        console.error("Error in subscription service:", error)
        throw new Error("Service unavailable")
    }
};


module.exports = {addSubscription,getMoviesByMember,findMembersByMovieId}