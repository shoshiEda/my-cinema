const axios = require("axios")

const URL = 'https://api.tvmaze.com/shows';

const getMovies = async() => {
    const {data : movies} = await axios.get(URL)
    const creationDate = Date.now()
    return movies.map(movie => ({name:movie.name,premiered:movie.premiered,genres:movie.genres,img:movie.image.medium,createAt:creationDate}))
}

module.exports = {getMovies}