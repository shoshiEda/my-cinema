const axios = require("axios")

const URL = 'https://api.tvmaze.com/shows';

const getMovies = async() => {
    const {data : movies} = await axios.get(URL)
    return movies.map(movie => ({name:movie.name,premiered:movie.premiered,genres:movie.genres,img:movie.url}))
}

module.exports = {getMovies}