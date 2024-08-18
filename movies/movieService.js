const movieModel = require("./movieModel")
const movieRepository = require("./movieRepository")
const subscriptionService = require("../subscriptions/subscriptionService")


const getAllMovies = async(search,pageIdx,limitPerPage,searchByGenre)=>{
    try{
    const countMovies = await movieModel.countDocuments({})
    let movies=[]
    if(!countMovies)
    {
        movies = await movieRepository.getMovies()
        for (const movie of movies) {
            const newMovie = new movieModel(movie)
            await newMovie.save()
        }
        movies = await movieModel.find({}).limit(limitPerPage)
        return {movies,isLastPage:false}
    }
    else{
        const lastPage = countMovies%limitPerPage? Math.floor(countMovies/limitPerPage)+1 : Math.floor(countMovies/limitPerPage)
        const isLastPage = lastPage===pageIdx+1? true : false
        const skip = pageIdx * limitPerPage;

        let query = { name: { $regex: search, $options: "i" } };
            if (searchByGenre) {
                query.genres = { $regex: new RegExp(searchByGenre, "i") }; 
            }

        movies = await movieModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitPerPage) 
        .lean() 
        
        fixedMovies = await Promise.all(movies.map(async (movie) => {
            const members = await subscriptionService.findMembersByMovieId(movie._id);
            return { ...movie, members }
        }))

        return {movies:fixedMovies,isLastPage}
    }
    
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}

const getAllMovieNames = ()=>{
    try{
    return movieModel.find({}, '_id name')
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
    return savedMovie
} catch (error) {
    console.error("Error in movie service:", error)
    throw new Error("Service unavailable")
}
}
const updateMovie = async(id, newData)=>{
    try{
    const updatedMovie = await movieModel.findByIdAndUpdate(id, newData)
    return updatedMovie
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

module.exports = {getAllMovies,getAllMovieNames,createMovie,updateMovie,deleteMovie,getMovieById}
