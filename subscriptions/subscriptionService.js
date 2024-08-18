const subscriptionModel = require("./subscriptionModel")
delete require.cache[require.resolve('../movies/movieService')];
//delete require.cache[require.resolve('../members/memberService')];
const memberService = require("../members/memberService")
const movieService = require("../movies/movieService");




const addSubscription = async (memberId, movieId, movieDate) => {
    try {
        const subscription = await subscriptionModel.findOne({ memberId });

        if (subscription) {
            subscription.movies.push({ movieId, date: movieDate })
            await subscription.save()
            return "Subscription added";
        }else {
            const newSubscription = new subscriptionModel({
                memberId,
                movies: [{ movieId, date: movieDate }]
            })
            await newSubscription.save()
            return "Subscription added";
        }
    } catch (error) {
        console.error("Error in subscription service:", error);
        throw new Error("Service unavailable");
    }
};




const getMoviesByMember = async(memberId)=>{
    try {
        const subscription = await subscriptionModel.findOne({ memberId })
        if (subscription) {
            
            const fullMoviesData = await Promise.all(subscription.movies.map(async(movie) => 
                {
                    const {_doc:fullMovieData} = await movieService.getMovieById(movie.movieId)
                    return {...fullMovieData,date:movie.date}
                } ))
            return fullMoviesData
        } else return []
        }
 catch (error) {
    console.error("Error in subscription service:", error)
    throw new Error("Service unavailable")
}
}




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

            return { ...member, dates }
        }))   
        return members
    } catch (error) {
        console.error("Error in subscription service:", error)
        throw new Error("Service unavailable")
    }
};


module.exports = {addSubscription,getMoviesByMember,findMembersByMovieId}