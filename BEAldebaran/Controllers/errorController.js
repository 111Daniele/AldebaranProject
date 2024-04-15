module.exports= (error, req, res, next)=> {
    console.log("ERRORE", error)
    return res.status(400).json({status: "error"})
}