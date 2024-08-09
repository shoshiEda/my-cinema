const express = require("express")
const router = express.Router()
const movieService = require("./movieService")

router.get("/", async (req, res) => {
    try{
    const movies = await movieService.getAllMovies()
    return res.json(movies)
} catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.get("/:id", async (req, res) => {
    try{
    const id = req.params.id 
    const movie = await movieService.getMovieById(id)
    return res.json(movie)
} catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.post("/", async (req, res) => {
    try{
    const { name , premiered = null , genres = [],img="" } = req.body
    const newMovie =  { name , premiered, genres, img}
    const status = await movieService.createMovie(newMovie)
    return res.json({ status })
} catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.put("/:id", async (req, res) => {
    try{
    const id = req.params.id
    const newData = req.body
    const status = await movieService.updateMovie(id, newData)
    return res.json({ status })
} catch (error) {
    console.error("Error editind movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})


router.delete("/:id", async (req, res) => {
    try{
    const id = req.params.id
    const status = await movieService.deleteMovie(id)
    return res.json({ status })
} catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
})

module.exports = router