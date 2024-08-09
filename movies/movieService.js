const movieModel = require("./movieModel")
const movieRepository = require("./movieRepository")
const subscriptionService = require("../subscriptions/subscriptionService")


const getAllMovies = async()=>{
    try{
    let movies = await movieModel.find({})
    if(!movies.length)
    {
        movies = await movieRepository.getMovies()
        for (const movie of movies) {
            if (movie._id) {
                delete movie._id;
            }
            const newMovie = new movieModel(movie)
            await newMovie.save()
        }
        movies = await movieModel.find({}); 
    }
    else{
        movies = await Promise.all(movies.map(async (movie) => {
            const members = await subscriptionService.findMembersByMovieId(movie._id);
            return { ...movie.toObject(), members }
        }))
    }
    return movies
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}




const getMovieById = async(id)=>{
    try{
    const movie = await movieModel.findById(id)
    return movie?  movie :  {}
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}
const createMovie = async(newMovie)=>{
    try{
    const savedMovie = new movieModel(newMovie)
    await savedMovie.save()
    return "saved"
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}
const updateMovie = async(id, newData)=>{
    try{
    await movieModel.findByIdAndUpdate(id, newData)
    return "Updated"
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}
const deleteMovie = async(id)=>{
    try{
    await movieModel.findByIdAndDelete(id)
    return "Deleted"
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}

module.exports = {getAllMovies,createMovie,updateMovie,deleteMovie,getMovieById}
